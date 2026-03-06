import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        logo: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        footer: ["var(--font-footer)", "Nanum Gothic", "sans-serif"],
      },
      colors: {
        primary: "#0052FF",
        foreground: "#111827",
        background: "#F9FAFB",
        navy: "#1B2A4A",
      },
      fontSize: {
        "body": ["18px", { lineHeight: "1.65" }],
        "body-lg": ["20px", { lineHeight: "1.7" }],
      },
      minHeight: {
        "touch": "48px",
      },
    },
  },
  plugins: [],
};

export default config;
