import { IS_BROWSER } from "$fresh/runtime.ts";
import LoadingMessage from "site/components/chat/LoadingMessage.tsx";
import Message from "site/components/chat/Message.tsx";
import SuggestionButton from "site/components/chat/SuggestionButton.tsx";
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

export default function Content({
  iconColor,
  assistant,
  pageTitle,
  pageSubtitle,
  suggestions,
}: Props) {
  messages.subscribe(() => {
    if (IS_BROWSER) {
      const messagesContainer = document.getElementById("messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  });

  return (
    <>
      {!messages.value.length
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
                <SuggestionButton
                  key={index}
                  text={suggestion.text}
                  onClick={() => {
                    const input = document.getElementById(
                      "chat-input",
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = suggestion.text;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )
        : (
          <div id="messages-container" class="w-full max-w-2xl mx-auto mb-8">
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
