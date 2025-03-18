import { signal } from "@preact/signals";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  username?: string;
}

export const messages = signal<Message[]>([]);
export const isAiThinking = signal(false);

export function setAiThinking(thinking: boolean) {
  isAiThinking.value = thinking;
}

export function addMessage(message: Omit<Message, "id" | "timestamp">) {
  messages.value = [
    ...messages.value,
    {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return messages.value;
}
