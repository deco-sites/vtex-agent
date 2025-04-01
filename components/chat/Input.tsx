import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import type { TargetedEvent } from "preact/compat";
import { useRef } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { invoke } from "site/runtime.ts";
import type { Assistant } from "site/sdk/assistants.ts";
import { clx } from "site/sdk/clx.ts";
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
  threadId: _threadId,
  resourceId,
}: Props) {
  const abortController = useSignal<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    event.currentTarget.reset();

    setAiThinking(true);

    requestAnimationFrame(() => {
      const loadingMessage = document.getElementById("loading-message");
      if (loadingMessage) {
        loadingMessage.scrollIntoView({ behavior: "smooth", inline: "end" });
      }
    });

    try {
      abortController.value = new AbortController();

      const threadMessages = getRecentThreadMessages();

      const aiResponse = await invoke(
        {
          key: "site/actions/chat/stream-ai-response.ts",
          props: {
            assistantUrl: assistant.url,
            message,
            // TODO @vitoUwu: change this to threadId when we have memory integrated correctly
            // I'm using resourceId just to keep the same account name configured across different threads (chats)
            threadId: resourceId,
            resourceId,
            threadMessages,
          },
        },
        {
          signal: abortController.value.signal,
        },
      );

      const newMessages: Message[] = [];
      let messageId: string | undefined = undefined;
      let content: undefined | string = undefined;

      abortController.value.signal.addEventListener("abort", () => {
        if (messageId) {
          editTextMessage(messageId, "Operação cancelada");
          messageId = undefined;
          content = undefined;
        } else {
          addTextMessage({
            role: "assistant",
            content: "Operação cancelada",
            username: assistant.title,
          });
        }

        setAiThinking(false);
      });

      for await (const chunk of aiResponse) {
        if (chunk.type === "error") {
          console.error(chunk.content);
          addTextMessage({
            role: "assistant",
            content:
              "Ocorreu um erro ao responder. Tente novamente mais tarde.",
            username: assistant.title,
          });
          continue;
        }

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
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error(error);
      addTextMessage({
        role: "assistant",
        content: "Ocorreu um erro ao responder. Tente novamente mais tarde.",
        username: assistant.title,
      });
    } finally {
      setAiThinking(false);
      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    }
  }

  return (
    <div class="relative w-full flex justify-center items-center">
      <button
        disabled={!isAiThinking.value || !IS_BROWSER}
        class={clx(
          "text-primary bg-neutral-lightest rounded-full border border-primary-light absolute left-1/2 -translate-x-1/2",
          "flex items-center gap-2 p-2 pr-3 h-10 transition-all duration-300 ease-in-out",
          isAiThinking.value && "opacity-100 -top-12 pointer-events-auto",
          !isAiThinking.value && "opacity-0 top-0 pointer-events-none",
        )}
        onClick={() => {
          abortController.value?.abort();
        }}
      >
        <Icon id="stop-fill" size={20} />
        <span>
          Stop
        </span>
      </button>
      <form
        onSubmit={handleSubmit}
        id="chat-form"
        autocomplete="off"
        class="bg-neutral-lightest rounded-2xl border border-neutral-light max-w-4xl w-full flex items-center gap-2 p-2"
      >
        <input
          ref={inputRef}
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
    </div>
  );
}
