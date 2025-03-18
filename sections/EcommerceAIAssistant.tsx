import { SectionProps } from "@deco/deco";
import type { AppContext } from "site/apps/site.ts";
import { Assistant, previewAssistants } from "site/sdk/assistants.ts";
import Icon from "../components/ui/Icon.tsx";

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

export default function EcommerceAIAssistant(
  props: SectionProps<typeof loader>,
) {
  const {
    mainTitle,
    mainSubtitle,
    sectionTitle,
    sectionSubtitle,
    primaryColor,
    headerBgColor,
    assistants,
  } = props || defaultProps;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Main Header */}
      <div
        class="w-full py-12 px-4 md:px-8"
        style={{ backgroundColor: headerBgColor }}
      >
        <div class="max-w-7xl mx-auto">
          <h1 class="text-4xl font-bold text-white">{mainTitle}</h1>
          <p class="text-lg text-white/80 mt-2">{mainSubtitle}</p>
        </div>
      </div>

      {/* Section Content */}
      <div class="w-full py-12 px-4 md:px-8">
        <div class="max-w-7xl mx-auto">
          {/* Section Header */}
          <div class="mb-10">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
              {sectionTitle}
            </h2>
            <p class="text-lg text-gray-600">{sectionSubtitle}</p>
          </div>

          {/* Cards Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assistants.map((assistant) => (
              <a
                href={assistant.url}
                class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 group"
              >
                <div class="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Icon
                      id={assistant.icon}
                      class="w-8 h-8 text-white"
                      size={32}
                    />
                  </div>

                  {/* Content */}
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {assistant.title}
                  </h3>
                  <p class="text-gray-600 mb-6">{assistant.description}</p>

                  {/* Button */}
                  <span
                    style={{ color: primaryColor }}
                    class="inline-flex items-center font-medium mt-auto"
                  >
                    <span>Start Assistant</span>
                    <Icon
                      id="ArrowRight"
                      class="ml-1 group-hover:ml-2 transition-all ease-in-out duration-300"
                      size={18}
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Preview() {
  return (
    <EcommerceAIAssistant
      {...defaultProps}
      assistants={previewAssistants}
    />
  );
}

const defaultProps: Props = {
  mainTitle: "VTEX AI Agents Studio",
  mainSubtitle: "Intelligent assistance for your e-commerce business",
  sectionTitle: "Select an Agent",
  sectionSubtitle: "Choose an AI agent to help manage and grow your VTEX store",
  primaryColor: "#f91880",
  headerBgColor: "#121c2e",
};
