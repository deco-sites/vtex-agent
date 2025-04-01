import { signal } from "@preact/signals";

interface BaseMessage {
  id: string;
  timestamp: string;
}

export interface ToolMessage extends BaseMessage {
  role: "tool";
  toolName: string;
  isLoading: boolean;
}

export interface TextMessage extends BaseMessage {
  role: "user" | "assistant";
  content: string;
  username: string;
}

export type Message = TextMessage | ToolMessage;

export const messages = signal<Message[]>([]);
export const isAiThinking = signal(false);

export function setAiThinking(thinking: boolean) {
  isAiThinking.value = thinking;
}

export function addToolMessage(
  message: Omit<ToolMessage, "id" | "timestamp" | "isLoading" | "role">,
) {
  const newMessage: ToolMessage = {
    ...message,
    role: "tool",
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isLoading: true,
  };

  messages.value = [...messages.value, newMessage];

  return newMessage;
}

export function editToolMessage(id: string, isLoading: boolean) {
  messages.value = messages.value.map((message) => {
    if (message.id === id && message.role === "tool") {
      return { ...message, isLoading };
    }

    return message;
  });
}

export function addTextMessage(message: Omit<TextMessage, "id" | "timestamp">) {
  const newMessage: TextMessage = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.value = [...messages.value, newMessage];

  return newMessage;
}

export function editTextMessage(id: string, content: string) {
  messages.value = messages.value.map((message) => {
    if (message.id === id) {
      return { ...message, content };
    }

    return message;
  });
}

export function getRecentThreadMessages() {
  const allMessages = messages.peek().filter((message) =>
    message.role !== "tool"
  );

  if (allMessages.length >= 2) {
    return allMessages.slice(-4, -1);
  }

  return [];
}

export const localThreads = new Map<string, Message[]>();

export function getLocalThread(threadId: string) {
  return localThreads.get(threadId) || [];
}

export function setLocalThread(threadId: string, messages: Message[]) {
  localThreads.set(threadId, messages);
}

export function deleteMessage(id: string) {
  messages.value = messages.value.filter((message) => message.id !== id);
  return messages.value;
}
