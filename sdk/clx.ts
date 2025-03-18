import type { SignalLike } from "$fresh/src/types.ts";

/** filter out nullable values, join and minify class names */
export const clx = (
  ...args:
    (string | null | undefined | false | SignalLike<string | undefined>)[]
) => args.filter(Boolean).join(" ").replace(/\s\s+/g, " ");
