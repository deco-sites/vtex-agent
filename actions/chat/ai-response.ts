import type { AppContext } from "site/apps/site.ts";
import { getAssistant } from "site/sdk/assistants.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
}

export default async function aiResponse(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const {
    message,
    threadId = "default",
    resourceId = "default",
    assistantUrl,
  } = props;

  const assistant = getAssistant(assistantUrl, ctx);
  if (!assistant) {
    throw new Error("Assistant not found");
  }

  if (!ctx.mcpServerURL) {
    throw new Error("MCP server URL not found");
  }

  if (!assistant.agent) {
    throw new Error("Assistant agent not found");
  }

  const messageWithContext = `Today is ${new Date().toUTCString()} UTC${
    ctx.globalContext ? `\n\n${ctx.globalContext}` : ""
  }\n\n${message}`;

  try {
    // Use the agent with the available tools, now with thread and resource IDs
    const response = await assistant.agent.stream(messageWithContext, {
      threadId,
      resourceId,
      // @ts-ignore ignore
      tools: await listMCPTools(ctx.mcpServerURL),
    });

    let fullResponse = "";
    for await (const part of response.fullStream) {
      switch (part.type) {
        case "error":
          console.error(part.error);
          throw new Error("Failed to process request");
        case "text-delta":
          console.log("text-delta", part.textDelta);
          fullResponse += part.textDelta;
          break;
        case "tool-call":
          console.info(`Tool call: ${part.toolName}`);
          break;
      }
    }

    return fullResponse;
  } catch (error) {
    console.error(error);
    return `I apologize, but I encountered an error processing your request.`;
  }
}
