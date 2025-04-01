import { logger } from "@deco/deco/o11y";
import type { AppContext } from "site/apps/site.ts";
import { getAssistant } from "site/sdk/assistants.ts";
import type { Message, TextMessage } from "site/sdk/messages.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
  threadMessages?: Message[];
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
    threadMessages = [],
  } = props;

  const accountName = ctx.accountName;

  const assistant = getAssistant(assistantUrl, ctx);
  if (!assistant) {
    logger.error("Assistant not found", props);
    throw new Error("Assistant not found");
  }

  if (!ctx.mcpServerURL) {
    logger.error("MCP server URL not found", props);
    throw new Error("MCP server URL not found");
  }

  if (!assistant.agent) {
    logger.error("Assistant agent not found", props);
    throw new Error("Assistant agent not found");
  }

  const oldMessages = threadMessages
    .filter((message): message is TextMessage => message.role !== "tool")
    .map((message) =>
      `[${message.timestamp}] ${message.role}: ${message.content}`
    ).join("\n\n");

  const messageWithContext = `
Today is ${new Date().toUTCString()} UTC

Current Thread Id: ${threadId}
Current Account Name: ${accountName}

<old-messages>
${oldMessages}
</old-messages>

<new-message>
${message}
</new-message>
`.slice(0, 200000); // anthropic max tokens

  const stream = (async function* () {
    const agentStream = await assistant.agent!.stream(
      messageWithContext,
      {
        threadId,
        resourceId,
        maxSteps: 10,
        system: ctx.globalContext,
        onError: ({ error }) => {
          logger.error(`Error streaming AI response: ${message}`, { error });
          console.error(error);
        },
        // @ts-ignore ignore
        tools: await listMCPTools(ctx.mcpServerURL!),
      },
    );

    for await (const part of agentStream.fullStream) {
      if (part.type === "error") {
        logger.error(`Error streaming AI response: ${message}`, {
          error: part.error,
        });
        console.error(part.error);
      }

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
