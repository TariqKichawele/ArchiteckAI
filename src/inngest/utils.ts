import{ Sandbox }from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";
import { SANDBOX_TIMEOUT } from "./types";

export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(SANDBOX_TIMEOUT);
    return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
    const lastMessage = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );
    

    const message = result.output[lastMessage] as TextMessage | undefined;
    
    return message?.content 
      ? typeof message.content === "string"
        ? message.content
        : message.content.map((part) => part.text).join("")
      : undefined;
}


export const parseAgentOutput = (value: Message[]) => {
  const output = value[0];

  if (output.type !== "text") {
      return "Fragment";
  }

  if (Array.isArray(output.content)) {
      return output.content.map((txt) => txt).join("");
  } else {
      return output.content;
  }
}