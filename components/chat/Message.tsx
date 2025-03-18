import { clx } from "site/sdk/clx.ts";
import { Message as Props } from "site/sdk/messages.ts";

export default function Message({
  id,
  role,
  content,
  timestamp,
  username,
}: Props) {
  const isUser = role === "user";

  return (
    <div key={id} class="space-y-2">
      {/* Role and timestamp */}
      <div
        class={clx(
          "flex items-center",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        <span
          class={clx(
            "text-xs font-medium",
            isUser ? "text-[#142032]" : "text-[#F71963]",
          )}
        >
          {username} • {timestamp}
        </span>
      </div>

      {/* Message content */}
      <div
        class={clx(
          "flex",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        <div
          class={clx(
            "max-w-[80%] md:max-w-[70%] rounded-lg p-4",
            isUser
              ? "bg-[#142032] text-white"
              : "bg-white border border-gray-100 text-[#142032]",
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
