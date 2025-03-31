import { Schemas } from "@deco/deco";
import { getTools } from "@deco/mcp";
import { createTool } from "@mastra/core/tools";
import { jsonSchemaToModel } from "@mastra/core/utils";
import { z } from "npm:zod@3.24.2";
import { accounts } from "site/sdk/account.ts";

export const fetchMeta = async (baseUrl: string) => {
  const response = await fetch(new URL("/live/_meta", baseUrl));
  const meta: { schema: Schemas } = await response.json();
  return meta;
};

export interface Options {
  include?: string[];
  exclude?: string[];
}
export const listMCPTools = async (
  mcpServerURL: string,
  options?: Options,
): Promise<Record<string, ReturnType<typeof createTool>>> => {
  const baseUrl = mcpServerURL;
  const meta = await fetchMeta(baseUrl);

  // deno-lint-ignore no-explicit-any
  const tools = getTools(new Map(), meta.schema, options as any);

  const createdTools: Record<string, ReturnType<typeof createTool>> = {};
  for (const tool of tools) {
    if (tool.name.includes("website")) {
      continue;
    }

    try {
      const createdTool = createTool({
        id: tool.name,
        description: tool.description,
        inputSchema: jsonSchemaToModel(tool.inputSchema),
        outputSchema: jsonSchemaToModel(
          tool.outputSchema ?? {
            type: "object",
            additionalProperties: true,
          },
        ),
        execute: async ({ context }) => {
          console.log({ context });
          const response = await fetch(
            new URL(`/live/invoke/${tool.resolveType}`, baseUrl),
            {
              method: "POST",
              body: typeof context === "string"
                ? context
                : JSON.stringify(context),
              headers: {
                "content-type": "application/json",
              },
            },
          )
            .then((res) => res.json())
            .catch((err) => {
              console.error(err);
              return {
                error: err.message,
              };
            });
          return response;
        },
      });

      createdTools[tool.name] = createdTool;
    } catch {
      // ignore
    }
  }

  createdTools["get-account-name"] = createTool({
    id: "get-account-name",
    description: "Gets the current thread account name",
    inputSchema: z.object({
      threadId: z.string(),
    }),
    outputSchema: z.object({
      accountName: z.string().optional(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      return { accountName: accounts.get(context.threadId) };
    },
  });
  createdTools["configure-account-name"] = createTool({
    id: "configure-account-name",
    description: "Configures the current thread account name",
    inputSchema: z.object({
      accountName: z.string(),
      threadId: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      accounts.set(context.threadId, context.accountName);
      return { success: true };
    },
  });

  return createdTools;
};
