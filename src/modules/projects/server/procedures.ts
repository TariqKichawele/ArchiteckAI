import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: { id: input.id, userId: ctx.auth.userId },
                include: {
                    messages: true,
                },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return project;
        }),
    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            const projects = await prisma.project.findMany({
                orderBy: { createdAt: "desc" },
                where: {
                    userId: ctx.auth.userId,
                }
            });

            return projects;
        }),
    create: protectedProcedure
        .input(z.object({
            value: z.string()
            .min(1, { message: "Value is required" })
            .max(10000, { message: "Value is too long" }),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await consumeCredits();
            } catch (error) {
                if (error instanceof Error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: error.message,
                    })
                } else {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "You have used all your free credits",
                    })
                }
            }
            
            const createdProject = await prisma.project.create({
                data: {
                    name: generateSlug(2, {
                        format: "kebab",
                    }),
                    userId: ctx.auth.userId,
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        }
                    }
                }
            });

            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: createdProject.id,
                }
            })

            return createdProject;
    
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            // First check if the project exists and belongs to the user
            const project = await prisma.project.findUnique({
                where: { id: input.id, userId: ctx.auth.userId },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            // Delete the project (this will cascade delete all messages and fragments)
            await prisma.project.delete({
                where: { id: input.id, userId: ctx.auth.userId },
            });

            return { success: true };
        }),
});