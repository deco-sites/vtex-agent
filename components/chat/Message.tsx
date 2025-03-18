import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { Message as Props } from "site/sdk/messages.ts";

export default function Message(props: Props) {
  if (props.role === "tool") {
    const { id, isLoading, toolName } = props;

    return (
      <div key={id} class="space-y-2">
        {/* Message content */}
        <div class="flex justify-start">
          <div
            class={clx(
              "max-w-[80%] md:max-w-[70%] rounded-lg p-2 text-sm",
              "bg-white border border-gray-100 text-[#142032]",
              "flex items-center gap-3",
            )}
          >
            Chamada de ferramenta:{" "}
            <span class="rounded border border-[#F71963] px-2 bg-[#F71963]/10">
              {toolName}
            </span>{" "}
            {isLoading ? <span class="loading loading-xs" /> : (
              <Icon
                id="Check"
                class="text-[#F71963]"
                size={16}
                strokeWidth={2}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const { id, role, content, username, timestamp } = props;
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
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>
    </div>
  );
}
