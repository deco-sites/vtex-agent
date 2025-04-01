import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { Message as Props } from "site/sdk/messages.ts";

marked.use({
  gfm: true,
  breaks: true,
  silent: true,
});

export default function Message(props: Props) {
  if (props.role === "tool") {
    const { id, isLoading, toolName } = props;

    return (
      <div key={id} class="space-y-2">
        {/* Message content */}
        <div class="flex justify-start">
          <div
            class={clx(
              "md:max-w-[70%] rounded-lg p-2 text-sm",
              "bg-white border border-gray-100 text-neutral-darkest",
              "flex items-center gap-3",
            )}
          >
            Chamada de ferramenta:{" "}
            <span class="rounded border border-primary px-2 bg-primary/10">
              {toolName}
            </span>{" "}
            {isLoading ? <span class="loading loading-xs" /> : (
              <Icon
                id="Check"
                class="text-primary"
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
            isUser ? "text-neutral-darkest" : "text-primary",
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
            "md:max-w-[70%] rounded-lg p-4 [--tw-prose-links:rgb(247_25_99_/_var(--tw-text-opacity))]",
            isUser
              ? "bg-neutral-darkest text-white"
              : "bg-white border border-gray-100 text-neutral-darkest",
            "markdown prose",
          )}
          dangerouslySetInnerHTML={{ __html: marked(content, {}) }}
        />
      </div>
    </div>
  );
}
