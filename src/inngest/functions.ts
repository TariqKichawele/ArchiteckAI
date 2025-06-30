import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork, Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

interface AgentState {
    taskSummary: string;
    files: { [path: string]: string };
};

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("architeckai");
        return sandbox.sandboxId;
    });
    
    const codeAgent = createAgent<AgentState>({
        name: "code-agent",
        description: "An expert coding agent",
        system: PROMPT,
        model: openai({ 
            model: "gpt-4.1", 
            defaultParameters: { 
                temperature: 0.1 
            } 
        }),
        tools: [
            createTool({
                name: "terminal",
                description: "Use the terminal to run commands.",
                parameters: z.object({
                    command: z.string(),
                }),
                handler: async ({ command }, { step }) => {
                    return await step?.run("terminal", async () => {
                        const buffers = { stdout: "", stderr: "" };

                        try {
                            const sandbox = await getSandbox(sandboxId);
                            const result = await sandbox.commands.run(command, {
                                onStdout: (data: string) => {
                                    buffers.stdout += data;
                                },
                                onStderr: (data: string) => {
                                    buffers.stderr += data;
                                },
                            });
                            
                            return result.stdout
                        } catch (error) {
                            console.error(`Error running command: ${buffers.stderr} ${error} ${buffers.stdout}`);
                            return `Error running command: ${buffers.stderr} ${error} ${buffers.stdout}`;
                        }
                    })
                },
            }),
            createTool({
                name: "createOrUpdateFiles",
                description: "Create or update files in the sandbox.",
                parameters: z.object({
                    files: z.array(
                        z.object({
                            path: z.string(),
                            content: z.string(),
                        })
                    )
                }),
                handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
                    const newFiles = await step?.run("createOrUpdateFiles", async () => {
                        try {
                            const updatedFiles = network.state.data.files || {};
                            const sandbox = await getSandbox(sandboxId);
                            for (const file of files) {
                                await sandbox.files.write(file.path, file.content);
                                updatedFiles[file.path] = file.content;
                            }
                            return updatedFiles;
                        } catch (error) {
                            console.error(`Error creating or updating files: ${error}`);
                        }
                    });

                    if (typeof newFiles === "object" && newFiles !== null) {
                        network.state.data.files = newFiles;
                    }
                }
            }),
            createTool({
                name: "readFiles",
                description: "Read files from the sandbox.",
                parameters: z.object({
                    files: z.array(z.string()),
                }),
                handler: async ({ files }, { step }) => {
                    return await step?.run("readFiles", async () => {
                        try {
                            const sandbox = await getSandbox(sandboxId);
                            const contents = [];
                            for (const file of files) {
                                const content = await sandbox.files.read(file);
                                contents.push({
                                    path: file,
                                    content,
                                });
                            }
                            return JSON.stringify(contents);
                        } catch (error) {
                            console.error(`Error reading files: ${error}`);
                            return `Error reading files: ${error}`;
                        }
                    })
                }
            })
        ],
        lifecycle: {
            onResponse: async ({ result, network }) => {
                const lastAssistantText = lastAssistantTextMessageContent(result);

                if (lastAssistantText && network) {
                    if (lastAssistantText?.includes("<task_summary>")) {
                        network.state.data.taskSummary = lastAssistantText;
                    }
                }
                return result;
            }
        }
    });

    const network = createNetwork<AgentState>({
        name: "coding-agent-network",
        agents: [codeAgent],
        maxIter: 15,
        router: async ({ network }) => {
            const summary = network.state.data.taskSummary;
            if (summary) {
                return;
            }

            return codeAgent;
        }
    })

    const result = await network.run(event.data.value);

    const isError = !result.state.data.taskSummary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `http://${host}`;
    })

    await step.run("save-result", async () => {
        if (isError) {
            return await prisma.message.create({
                data: {
                    content: "Something went wrong, please try again.",
                    role: "ASSISTANT",
                    type: "ERROR",
                    projectId: event.data.projectId,
                }
            })
        }
        return await prisma.message.create({
            data: {
                content: result.state.data.taskSummary || "Task completed successfully",
                role: "ASSISTANT",
                type: "RESULT",
                fragment: {
                    create: {
                        sandboxUrl: sandboxUrl,
                        title: "Fragment",
                        files: result.state.data.files,
                    }
                },
                projectId: event.data.projectId,
            }
        })
    })

    return { 
        url: sandboxUrl,
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.taskSummary || "Task completed successfully",
    };
  },
);
