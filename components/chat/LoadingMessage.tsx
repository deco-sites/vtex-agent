interface Props {
  username: string;
}

export default function LoadingMessage({ username }: Props) {
  return (
    <div class="space-y-2">
      <div class="flex items-center justify-start">
        <span class="text-xs font-medium text-[#F71963]">
          {username} • {new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div class="flex justify-start">
        <div class="bg-white border border-gray-100 text-[#142032] max-w-[80%] md:max-w-[70%] rounded-lg p-4">
          <div class="flex space-x-2">
            <div
              class="size-2 bg-[#F71963] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            >
            </div>
            <div
              class="size-2 bg-[#F71963] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            >
            </div>
            <div
              class="size-2 bg-[#F71963] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
