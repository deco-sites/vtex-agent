import type { AppContext } from "site/apps/site.ts";
import { getAssistant } from "site/sdk/assistants.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
}

interface StreamResponse {
  type: "text-delta" | "tool-call" | "tool-result";
  content: string;
}

export default function stream(
  props: Props,
  _req: Request,
  ctx: AppContext,
): AsyncIterableIterator<StreamResponse> {
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

  const stream = (async function* () {
    const agentStream = await assistant.agent!.stream(message, {
      threadId,
      resourceId,
      // @ts-ignore ignore
      tools: await listMCPTools(ctx.mcpServerURL!),
    });

    for await (const part of agentStream.fullStream) {
      if (part.type === "text-delta") {
        yield {
          type: "text-delta" as const,
          content: part.textDelta,
        };
      }

      if (part.type === "tool-call") {
        yield {
          type: "tool-call" as const,
          content: part.toolName,
        };
      }

      if (part.type === "tool-result") {
        yield {
          type: "tool-result" as const,
          content: part.toolName,
        };
      }
    }
  })();

  return stream;
}
