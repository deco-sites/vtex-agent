import { SectionProps } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";
import type { AppContext } from "site/apps/site.ts";
import AssistantCard from "site/components/home/AssistantCard.tsx";
import Sidebar from "site/components/home/Sidebar.tsx";
import { Assistant, previewAssistants } from "site/sdk/assistants.ts";

interface Props {
  /**
   * @title Título principal
   */
  mainTitle: string;
  /**
   * @title Subtítulo principal
   */
  mainSubtitle: string;
  /**
   * @title Título da seção
   */
  sectionTitle: string;
  /**
   * @title Subtítulo da seção
   */
  sectionSubtitle: string;
  /**
   * @title Cor primária
   * @description Cor primária para botões e ícones
   */
  primaryColor: string;
  /**
   * @title Cor do fundo do cabeçalho
   */
  headerBgColor: string;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return {
    ...props,
    assistants: ctx.assistants as Assistant[],
  };
}

export default function Home(
  props: SectionProps<typeof loader>,
) {
  const { mainSubtitle, assistants } = props || defaultProps;

  return (
    <div
      class="min-h-screen flex bg-white"
      style={{
        backgroundImage: "url(/background-dots.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Sidebar */}
      <Sidebar assistants={assistants} />

      {/* Main Content */}
      <div class="px-4 pt-16">
        <header class="flex flex-col gap-3.5">
          <div class="flex items-center gap-3.5">
            <Image
              src="https://assets.decocache.com/vtex-agent/b7b071f7-62e1-4e42-bc7f-8397088dc9b4/Frame-2147223556.png"
              width={113}
              height={42}
              alt="vtex logo"
            />
            <div class="w-px h-9 bg-primary" />
            <h1 class="text-primary text-xl font-medium">
              AI Agents Studio
            </h1>
          </div>
          <p class="text-neutral-dark text-base">{mainSubtitle}</p>
        </header>

        {/* Main Content Area */}
        <main class="mt-10">
          {/* Agent Cards */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Catalog Enricher */}
            {assistants.map((assistant) => (
              <AssistantCard
                icon={assistant.icon}
                title={assistant.title}
                description={assistant.description}
                url={assistant.url}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Preview() {
  return (
    <Home
      {...defaultProps}
      assistants={previewAssistants}
    />
  );
}

const defaultProps: Props = {
  mainTitle: "AI Agents Studio",
  mainSubtitle: "Intelligent assistance for your e-commerce business",
  sectionTitle: "Select an Agent",
  sectionSubtitle: "Choose an AI agent to help manage and grow your VTEX store",
  primaryColor: "#F71963",
  headerBgColor: "#142032",
};
