import typography from "@tailwindcss/typography";
// import daisyui from "daisyui";

export default {
  plugins: [typography()],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      fontFamily: {
        sans: ['"VTEX Trust"', "sans-serif"],
      },
      colors: {
        "primary": {
          darkest: "#940F3B",
          dark: "#000c2d",
          DEFAULT: "#000c2d",
          light: "#000c2d",
          lightest: "#FFF3F6",
        },
        "secondary": {
          darkest: "#071127",
          dark: "#142032",
          DEFAULT: "#335280",
          light: "#DFE9F8",
          lightest: "#F5F9FF",
        },
        "neutral": {
          darkest: "#000c2d",
          dark: "#5a5c66",
          DEFAULT: "#C3C6CC",
          light: "#F1F1F5",
          lightest: "#FFFFFF",
        },
      },
    },
  },
};
