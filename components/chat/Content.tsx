import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";
import LoadingMessage from "site/components/chat/LoadingMessage.tsx";
import Message from "site/components/chat/Message.tsx";
import Icon from "site/components/ui/Icon.tsx";
import type { Assistant } from "site/sdk/assistants.ts";
import { isAiThinking, messages } from "site/sdk/messages.ts";
import type { ChatSuggestion } from "site/sections/Chat.tsx";

interface Props {
  iconColor: string;
  assistant: Assistant;
  pageTitle: string;
  pageSubtitle: string;
  suggestions: ChatSuggestion[];
}

const shouldAutoScroll = signal(true);

export default function Content({
  assistant,
}: Props) {
  messages.subscribe(() => {
    if (IS_BROWSER && shouldAutoScroll.value) {
      const messagesContainer = document.getElementById("messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  });

  if (IS_BROWSER) {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      // Desativa o auto-scroll quando o usuário rola manualmente
      messagesContainer.addEventListener("scroll", () => {
        const isAtBottom =
          messagesContainer.scrollHeight - messagesContainer.scrollTop <=
            messagesContainer.clientHeight + 100;
        shouldAutoScroll.value = isAtBottom;
      });
    }
  }

  return (
    <>
      {!IS_BROWSER
        ? (
          <div class="max-w-4xl mx-auto px-3 mb-8 flex justify-center items-center">
            <span class="text-primary loading loading-ring loading-lg" />
          </div>
        )
        : !messages.value.length
        ? (
          <>
            <span class="size-12 flex justify-center items-center rounded-xl bg-gradient-to-t from-primary-dark to-primary-light p-0.5">
              <span class="size-full flex justify-center items-center rounded-[10px] bg-primary">
                <Icon
                  strokeWidth={1}
                  id={assistant.icon}
                  class="text-primary-lightest"
                  size={28}
                />
              </span>
            </span>
            <div class="text-center">
              <h1 class="text-neutral-darkest text-2xl">
                Start chatting with {assistant.title}
              </h1>
              <p class="text-neutral-dark text-base">
                {assistant.description}
              </p>
            </div>
          </>
        )
        : (
          <div
            id="messages-container"
            class="w-full max-w-4xl mx-auto px-3 pb-3 space-y-2 overflow-y-auto"
          >
            {messages.value.map((message) => <Message {...message} />)}
            {isAiThinking.value && (
              <LoadingMessage
                username={assistant.title}
              />
            )}
          </div>
        )}
    </>
  );
}
