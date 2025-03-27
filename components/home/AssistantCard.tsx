import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";

interface Props {
  icon: AvailableIcons;
  title: string;
  description: string;
  url: string;
}

export default function AssistantCard({
  icon,
  title,
  description,
  url,
}: Props) {
  return (
    <a
      href={url}
      class="bg-white rounded-2xl border border-neutral-light overflow-hidden"
    >
      <div class="p-5">
        <div class="size-16 rounded-2xl p-0.5 bg-gradient-to-t from-primary-dark to bg-primary-light flex items-center justify-center mb-4">
          <div class="size-full rounded-[14px] bg-primary flex justify-center items-center">
            <Icon
              strokeWidth={1}
              id={icon}
              class="text-primary-lightest"
              size={36}
            />
          </div>
        </div>
        <h3 class="text-lg font-medium text-neutral-darkest mb-2">
          {title}
        </h3>
        <p class="text-neutral-dark text-sm">
          {description}
        </p>
      </div>
    </a>
  );
}
