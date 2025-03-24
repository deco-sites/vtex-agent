import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
  plugins: [daisyui, typography()],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: { container: { center: true } },
};
