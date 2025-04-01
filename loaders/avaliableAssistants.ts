import { allowCorsFor } from "@deco/deco";
import { AppContext } from "site/apps/site.ts";

// Used to load all available icons that will be used for IconSelect widgets.
export default function AvailableAssistantsLoader(
  _props: unknown,
  req: Request,
  ctx: AppContext,
) {
  // Allow Cors
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });
  // Mapping icons to { value, label, icon }
  const assistants = ctx.assistants.map((assistant) => ({
    icon: assistant.icon,
    label: assistant.title,
    value: assistant.url,
  }));
  return assistants;
}
