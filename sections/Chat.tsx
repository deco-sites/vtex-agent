import { SectionProps } from "@deco/deco";
import { AppContext } from "site/apps/site.ts";
import Content from "site/components/chat/Content.tsx";
import Input from "site/components/chat/Input.tsx";
import {
  type Assistant,
  getAssistant,
  previewAssistants,
} from "site/sdk/assistants.ts";
import Icon from "../components/ui/Icon.tsx";

export interface ChatSuggestion {
  /**
   * @title Sugestão
   */
  text: string;
}

interface ChatMessage {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
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
  /**
   * @ignore
   */
  messages: ChatMessage[];
}

export function loader(props: Props, req: Request, ctx: AppContext) {
  const assistant = getAssistant(req.url, ctx) as Assistant;

  return {
    ...props,
    assistant,
    messages: [] as ChatMessage[],
    threadId: crypto.randomUUID(),
    resourceId: "default",
  };
}

export default function Chat({
  iconColor,
  pageTitle,
  pageSubtitle,
  suggestions,
  assistant,
  threadId,
  resourceId,
}: SectionProps<typeof loader>) {
  if (!assistant) {
    return <div>Assistant not found</div>;
  }

  return (
    <div class="h-screen overflow-hidden flex flex-col bg-gray-50">
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
      <main
        id="container"
        class="flex-grow flex flex-col items-center p-4 h-fit overflow-y-auto"
      >
        <Content
          iconColor={iconColor}
          assistant={assistant}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          suggestions={suggestions}
        />
      </main>

      {/* Footer with Input */}
      <footer class="bg-white border-t border-gray-200 p-4">
        <Input
          placeholder={`Ask ${assistant.title.toLowerCase()} something...`}
          assistant={assistant}
          threadId={threadId}
          resourceId={resourceId}
        />
      </footer>
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
