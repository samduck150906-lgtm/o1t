import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B",
        "primary-dark": "#D97706",
        "primary-light": "#FEF3C7",
        foreground: "#1F2937",
        background: "#ffffff",
        navy: "#1B2A4A",
      },
      fontSize: {
        "body": ["18px", { lineHeight: "1.65" }],
        "body-lg": ["20px", { lineHeight: "1.7" }],
      },
      minHeight: {
        "touch": "48px",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #FFFBEB 0%, #FEF9EE 50%, #ffffff 100%)",
        "cta-gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
