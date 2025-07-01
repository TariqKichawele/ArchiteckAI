import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            projectId: z.string().optional(),
        }))
        .query(async ({ input }) => {
            return prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                },
                orderBy: { updatedAt: "asc"},
                include: {
                    fragment: true,
                }
            });
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string()
                .min(1, { message: "Message cannot be empty" })
                .max(10000, { message: "Message is too long" }),
                projectId: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const newMessage = await prisma.message.create({
                data: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                    projectId: input.projectId,
                }
            });

            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: input.projectId,
                }
            })

            return newMessage;
           
        })
})