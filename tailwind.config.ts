import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        surface: "#131820",
        surface2: "#1B222C",
        border: "#232B36",
        text: "#E8ECF1",
        muted: "#8A95A5",
        positive: "#3DDC84",
        negative: "#FF5C5C",
        signal: "#F2B84B",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: { card: "10px" },
    },
  },
  plugins: [],
};
export default config;
