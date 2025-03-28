import { IS_BROWSER } from "$fresh/runtime.ts";
import type { TargetedEvent } from "preact/compat";
import Icon from "site/components/ui/Icon.tsx";
import { invoke } from "site/runtime.ts";
import type { Assistant } from "site/sdk/assistants.ts";
import {
  addTextMessage,
  addToolMessage,
  editTextMessage,
  editToolMessage,
  getRecentThreadMessages,
  isAiThinking,
  Message,
  setAiThinking,
} from "site/sdk/messages.ts";

interface Props {
  placeholder: string;
  assistant: Assistant;
  threadId: string;
  resourceId: string;
}

export default function Input({
  placeholder,
  assistant,
  threadId,
  resourceId,
}: Props) {
  async function handleSubmit(event: TargetedEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const message = formData.get("message") as string;

    if (!message) {
      return;
    }

    addTextMessage({
      role: "user",
      content: message,
      username: "You",
    });

    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    event.currentTarget.reset();

    setAiThinking(true);

    try {
      const threadMessages = getRecentThreadMessages();

      const aiResponse = await invoke({
        key: "site/actions/chat/stream-ai-response.ts",
        props: {
          assistantUrl: assistant.url,
          message,
          threadId,
          resourceId,
          threadMessages,
        },
      });

      const newMessages: Message[] = [];
      let messageId: string | undefined = undefined;
      let content: undefined | string = undefined;

      for await (const chunk of aiResponse) {
        if (chunk.type === "text-delta") {
          if (!messageId) {
            const message = addTextMessage({
              role: "assistant",
              content: chunk.content,
              username: assistant.title,
            });

            newMessages.push(message);
            messageId = message.id;
            content = chunk.content;
          } else {
            content += chunk.content;
            editTextMessage(messageId, content!);
          }
          continue;
        }

        if (chunk.type === "tool-call") {
          const message = addToolMessage({
            toolName: chunk.content,
          });

          newMessages.push(message);
          messageId = message.id;
          content = undefined;
          continue;
        }

        if (chunk.type === "tool-result") {
          if (messageId) {
            editToolMessage(messageId, false);
          }

          messageId = undefined;
          content = undefined;
          continue;
        }
      }
    } catch (error) {
      console.error(error);
      addTextMessage({
        role: "assistant",
        content: "Ocorreu um erro ao responder. Tente novamente mais tarde.",
        username: assistant.title,
      });
    } finally {
      setAiThinking(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="chat-form"
      autocomplete="off"
      class="bg-neutral-lightest rounded-2xl border border-neutral-light max-w-[800px] w-full flex items-center gap-2 p-2"
    >
      <input
        disabled={isAiThinking.value || !IS_BROWSER}
        name="message"
        id="chat-input"
        type="text"
        placeholder={placeholder}
        class="p-3 focus:outline-none w-full border-none disabled:opacity-50 placeholder:text-neutral-dark placeholder:text-sm bg-transparent"
      />
      <button
        disabled={isAiThinking.value || !IS_BROWSER}
        class="ml-2 p-3 bg-primary text-primary-lightest rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        <Icon id="ArrowRight" size={20} />
      </button>
    </form>
  );
}
