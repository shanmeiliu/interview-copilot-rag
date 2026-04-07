import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#27272a",
        panel: "#111214",
        panelSoft: "#18181b",
        mutedText: "#a1a1aa"
      }
    }
  },
  plugins: []
} satisfies Config;