import type { AvailableIcons } from "site/components/ui/Icon.tsx";
import type { AppContext } from "site/apps/site.ts";
import type { Agent } from "@mastra/core";

export interface Assistant {
  /**
   * @title Título do assistente
   */
  title: string;
  /**
   * @title Descrição do assistente
   * @description Texto explicativo sobre o que o assistente faz
   */
  description: string;
  /**
   * @title Ícone do assistente
   * @description Selecione um dos ícones disponíveis no sistema
   */
  icon: AvailableIcons;
  /**
   * @title URL do assistente
   * @description Link para onde o botão direciona
   */
  url: string;
  /**
   * @title Instruções do assistente
   * @format textarea
   */
  instructions: string;
}

export interface AssistantWithAgent extends Assistant {
  agent?: Agent;
}

export const previewAssistants: Assistant[] = [
  {
    title: "Content Enricher",
    icon: "ArrowsPointingOut",
    description:
      "Enhances product descriptions, generates SEO content, and improves product imagery suggestions.",
    url: "/content-enricher",
    instructions: "Ask questions or get help with your VTEX store",
  },
  {
    title: "Analytics Advisor",
    icon: "BarChart3",
    description:
      "Analyzes store performance, sales trends, and provides actionable insights to boost revenue.",
    url: "/analytics-advisor",
    instructions: "Ask questions or get help with your VTEX store",
  },
  {
    title: "Order Manager",
    icon: "Package",
    description:
      "Helps track orders, manage fulfillment, and handle customer inquiries about purchases.",
    url: "/order-manager",
    instructions: "Ask questions or get help with your VTEX store",
  },
];

export function getAssistant(pathnameOrURL: string | URL, ctx: AppContext) {
  const pathname = pathnameOrURL instanceof URL
    ? pathnameOrURL.pathname
    : new URL(pathnameOrURL, "http://localhost:3000").pathname;

  const assistant = ctx.assistants.find((assistant) =>
    assistant.url.toLowerCase() === pathname.toLowerCase()
  );

  return assistant;
}
