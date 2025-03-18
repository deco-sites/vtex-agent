import { SectionProps } from "@deco/deco";
import { useScript } from "@deco/deco/hooks";
import { AppContext } from "site/apps/site.ts";
import Icon from "../components/ui/Icon.tsx";

export interface ChatSuggestion {
  /**
   * @title Sugestão
   */
  text: string;
}

export interface Props {
  /**
   * @title Cor do ícone
   */
  iconColor: string;
  /**
   * @title Título da página
   */
  pageTitle: string;
  /**
   * @title Subtítulo da página
   */
  pageSubtitle: string;
  /**
   * @title Sugestões
   * @description Lista de sugestões para iniciar a conversa
   */
  suggestions: ChatSuggestion[];
}

export function loader(props: Props, req: Request, ctx: AppContext) {
  const url = new URL(req.url);
  const assistant = ctx.assistants.find((assistant) =>
    assistant.url.toLowerCase() === url.pathname.toLowerCase()
  );

  return {
    ...props,
    assistant,
  };
}

export default function Chat({
  iconColor,
  pageTitle,
  pageSubtitle,
  suggestions,
  assistant,
}: SectionProps<typeof loader>) {
  if (!assistant) {
    return <div>Assistant not found</div>;
  }

  return (
    <div class="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header class="bg-[#121c2e] text-white p-4 flex items-center">
        <a href="/" class="mr-4">
          <Icon id="ChevronLeft" strokeWidth={2} size={24} />
        </a>
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: iconColor }}
          >
            <Icon id={assistant.icon} size={20} class="text-white" />
          </div>
          <h1 class="text-xl font-bold">{assistant.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main class="flex-grow flex flex-col items-center justify-center p-4">
        <div class="text-center max-w-2xl mx-auto mb-8">
          {/* Avatar */}
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: iconColor }}
          >
            <Icon id={assistant.icon} size={32} class="text-white" />
          </div>

          {/* Title and Subtitle */}
          <h2 class="text-2xl font-bold mb-2">{pageTitle}</h2>
          <p class="text-gray-600 mb-8">{pageSubtitle}</p>

          {/* Suggestions */}
          <div class="space-y-2 w-full max-w-lg mx-auto">
            {suggestions.map((suggestion, index) => (
              <button
                hx-on:click={useScript((text: string) => {
                  const input = document.getElementById(
                    "chat-input",
                  ) as HTMLInputElement;
                  if (input) {
                    input.value = text;
                  }
                }, suggestion.text)}
                key={index}
                class="block w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer with Input */}
      <footer class="bg-white border-t border-gray-200 p-4">
        <div class="max-w-4xl mx-auto flex items-center">
          <input
            id="chat-input"
            type="text"
            placeholder={`Ask ${assistant.title.toLowerCase()} something...`}
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f91880] focus:border-transparent"
          />
          <button class="ml-2 p-3 bg-[#f91880] text-white rounded-lg hover:bg-[#e0157a] transition-colors">
            <Icon id="ArrowRight" size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export function Preview() {
  return (
    <Chat
      assistant={{
        title: "Product Creator",
        icon: "ShoppingBag",
        description: "Ask questions or get help with your VTEX store",
        url: "/product-creator",
      }}
      iconColor="#f91880"
      pageTitle="Start chatting with Product Creator"
      pageSubtitle="Ask questions or get help with your VTEX store"
      suggestions={[
        { text: "Create a new product listing for me" },
        { text: "Help me optimize my product pricing" },
        { text: "What information should I include in my product specs?" },
      ]}
    />
  );
}
