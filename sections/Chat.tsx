import { SectionProps } from "@deco/deco";
import { useScript } from "@deco/deco/hooks";
import { AppContext } from "site/apps/site.ts";
import {
  Assistant,
  getAssistant,
  previewAssistants,
} from "site/sdk/assistants.ts";
import { useComponent } from "site/sections/Component.tsx";
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
  return {
    ...props,
    assistant: getAssistant(req.url, ctx) as Assistant,
    messages: [],
    threadId: crypto.randomUUID(),
    resourceId: "default",
  };
}

export async function action(props: Props, req: Request, ctx: AppContext) {
  const assistant = getAssistant(req.url, ctx) as Assistant;

  if (req.method === "POST") {
    const formData = await req.formData();
    const message = formData.get("message")?.toString() || "";
    const currentMessages = JSON.parse(
      formData.get("messages")?.toString() || "[]",
    );
    const threadId = formData.get("threadId")?.toString() ||
      crypto.randomUUID();
    const resourceId = formData.get("resourceId")?.toString() || "default";

    // Add user message
    const newMessages = [...currentMessages, {
      content: message,
      role: "user",
      timestamp: new Date().toISOString(),
    }];

    // Get AI response - now with thread and resource IDs
    const aiResponse = await ctx.invoke.site.actions.chat["ai-response"]({
      message,
      threadId,
      resourceId,
      assistantUrl: assistant.url,
    });

    newMessages.push({
      content: aiResponse || "I'm sorry, I couldn't process that request.",
      role: "assistant",
      timestamp: new Date().toISOString(),
    });

    return {
      ...props,
      messages: newMessages,
      threadId,
      resourceId,
      assistant,
    };
  }

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
  messages,
  threadId,
  resourceId,
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
        {!messages?.length
          ? (
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
          )
          : (
            <div id="messages-container" class="w-full max-w-2xl mx-auto mb-8">
              {messages.map((message, index) => (
                <div
                  key={index}
                  class="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  {message}
                </div>
              ))}
            </div>
          )}
      </main>

      {/* Footer with Input */}
      <footer class="bg-white border-t border-gray-200 p-4">
        <form
          hx-post={useComponent(import.meta.url)}
          id="chat-form"
          class="max-w-4xl mx-auto flex items-center"
        >
          <input
            type="hidden"
            name="messages"
            value={JSON.stringify(messages)}
          />
          <input
            type="hidden"
            name="threadId"
            value={threadId}
          />
          <input
            type="hidden"
            name="resourceId"
            value={resourceId}
          />
          <input
            id="chat-input"
            type="text"
            placeholder={`Ask ${assistant.title.toLowerCase()} something...`}
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f91880] focus:border-transparent"
          />
          <button class="ml-2 p-3 bg-[#f91880] text-white rounded-lg hover:bg-[#e0157a] transition-colors">
            <Icon id="ArrowRight" size={20} />
          </button>
        </form>
      </footer>
      <script>
        {`
          document.body.addEventListener('htmx:afterRequest', function(evt) {
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          });
          // Initial scroll
          const messagesContainer = document.getElementById('messages-container');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        `}
      </script>
    </div>
  );
}

export function Preview() {
  return (
    <Chat
      messages={[]}
      threadId={crypto.randomUUID()}
      resourceId="default"
      assistant={previewAssistants[0]}
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
