import { createAnthropic } from "@ai-sdk/anthropic";
import { type App, type AppContext as AC } from "@deco/deco";
import { Agent } from "@mastra/core/agent";
import { Secret } from "apps/website/loaders/secret.ts";
import website, { Props as WebsiteProps } from "apps/website/mod.ts";
import type { Assistant, AssistantWithAgent } from "site/sdk/assistants.ts";
import manifest, { Manifest } from "../manifest.gen.ts";

type WebsiteApp = ReturnType<typeof website>;

interface Props extends WebsiteProps {
  /**
   * @title MCP Server URL
   * @description The URL of the MCP server
   */
  mcpServerURL?: string;
  assistants: Assistant[];
  anthropicApiKey?: Secret;
  /**
   * @title Global Context
   * @description The global context for the assistants
   * @format textarea
   */
  globalContext?: string;
}

interface State extends Props {
  assistants: AssistantWithAgent[];
}

/**
 * @title Site
 * @description Start your site from a template or from scratch.
 * @category Tool
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8
 */
export default function Site(props: Props): App<Manifest, State, [
  WebsiteApp,
]> {
  const anthropicApiKey = props.anthropicApiKey?.get();
  const anthropic = anthropicApiKey
    ? createAnthropic({
      apiKey: anthropicApiKey,
    })
    : undefined;

  const assistants = props.assistants.map((assistant) => ({
    ...assistant,
    agent: anthropic
      ? new Agent({
        name: assistant.title,
        instructions: assistant.instructions,
        model: anthropic("claude-3-7-sonnet-20250219"),
      })
      : undefined,
  }));

  const state = { ...props, assistants };

  return {
    // @ts-ignore ignore type error
    state,
    manifest,
    dependencies: [
      website(state),
    ],
  };
}

export type SiteApp = ReturnType<typeof Site>;
export type AppContext = AC<SiteApp>;
export { onBeforeResolveProps, Preview } from "apps/website/mod.ts";
