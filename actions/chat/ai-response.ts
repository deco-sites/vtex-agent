import type { AppContext } from "site/apps/site.ts";
import { getAssistant } from "site/sdk/assistants.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
}

/**
 * Handles AI chat responses using Mastra agent
 */
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
    return "Assistant not found";
  }

  if (!ctx.mcpServerURL) {
    return "MCP server URL not found";
  }

  if (!assistant.agent) {
    return "Assistant agent not found";
  }

  try {
    // Use the agent with the available tools, now with thread and resource IDs
    const response = await assistant.agent.stream(message, {
      threadId,
      resourceId,
      tools: await listMCPTools(ctx.mcpServerURL),
    });

    let fullResponse = "";
    for await (const part of response.fullStream) {
      switch (part.type) {
        case "error":
          console.error(part.error);
          throw new Error("Failed to process request");
        case "text-delta":
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
