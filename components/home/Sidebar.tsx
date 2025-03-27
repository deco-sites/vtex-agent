import Icon from "site/components/ui/Icon.tsx";
import { Assistant } from "site/sdk/assistants.ts";

interface Props {
  assistants: Assistant[];
}

export default function Sidebar(props: Props) {
  const { assistants } = props;

  return (
    <div class="w-14 bg-white flex flex-col items-center p-2">
      <div class="mb-2">
        <a href="/" class="flex items-center justify-center size-10">
          <img
            width={24}
            height={20}
            src="https://assets.decocache.com/vtex-agent/3b51bbbf-fa1e-489a-be3f-bb9601f2c90b/image-732-(1).png"
            alt="vtex logo"
          />
        </a>
      </div>
      <nav class="flex flex-col items-center justify-center">
        <a href="/" class="size-9 flex justify-center items-center">
          <Icon
            id="Home"
            class="text-neutral-darkest"
            size={20}
          />
        </a>
        <div class="w-8 h-px bg-neutral-light my-2" />
        {assistants.map((assistant) => (
          <a
            href={assistant.url}
            class="size-9 flex justify-center items-center"
          >
            <span class="flex justify-center items-center size-6 rounded-[9px] p-px bg-gradient-to-t from-primary-dark to-primary-light">
              <span class="flex justify-center items-center size-full rounded-lg bg-primary">
                <Icon
                  strokeWidth={1}
                  id={assistant.icon}
                  class="text-primary-lightest"
                  size={14}
                />
              </span>
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
