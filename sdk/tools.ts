import { Schemas } from "@deco/deco";
import { getTools } from "@deco/mcp";
import { createTool } from "@mastra/core/tools";
import { jsonSchemaToModel } from "@mastra/core/utils";
import { logger } from "@deco/deco/o11y";
import { z } from "npm:zod@3.24.2";
import { accounts, urls } from "site/sdk/account.ts";

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
    if (tool.name.includes("website") || tool.resolveType.includes("action")) {
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

  createdTools["get-buy-product-url"] = createTool({
    id: "get-buy-product-url",
    description: "Returns the URL of that send the user directly to the cart with the product added.",
    inputSchema: z.object({
      productId: z.string(),
    }),
    outputSchema: z.object({
      url: z.string().optional(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      const url = urls.get(context.threadId);
      if (!url) {
        return { url: undefined };
      }
      return { url: `${url}/checkout/cart/add?sku=${context.productId}&qty=1&seller=1` };
    },
  });

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
  createdTools["configure-account-url"] = createTool({
    id: "configure-account-url",
    description: "Configures the current thread account url",
    inputSchema: z.object({
      url: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      urls.set(context.threadId, context.url);
      return { success: true };
    },
  });
  createdTools["get-account-url"] = createTool({
    id: "get-account-url",
    description: "Gets the current thread account url",
    inputSchema: z.object({
      threadId: z.string(),
    }),
    outputSchema: z.object({
      url: z.string().optional(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      return { url: urls.get(context.threadId) };
    },
  });
  createdTools["get-account-by-url"] = createTool({
    id: "get-account-by-url",
    description: "Gets the account name by url",
    inputSchema: z.object({
      url: z.string(),
    }),
    outputSchema: z.object({
      accountName: z.string().optional(),
      error: z.string().optional(),
    }),
    execute: async ({ context }) => {
      try {
        const baseUrl = context.url.startsWith("https://")
          ? context.url
          : `https://${context.url}`;
        const repo = await fetch(
          new URL(
            "/api/catalog_system/pub/products/search?_from=0&_to=1",
            baseUrl,
          ),
        );
        const result = await repo.json();

        const brandImageUrl = result[0]?.brandImageUrl as string | undefined;
        const imageUrl = result[0]?.items[0]?.images[0]?.imageUrl as
          | string
          | undefined;

        const accountName = (brandImageUrl || imageUrl)
          ?.split("//")[1]
          ?.split(".")[0] as string | undefined;

        return { accountName: accountName };
      } catch (error) {
        logger.error(`Error getting account name: ${context.url}`, { error });
        console.error(error);
        return {
          accountName: undefined,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });

  return createdTools;
};
