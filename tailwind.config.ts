import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#121212", // page background
        surface: "#1E1E1E", // card / raised surface
        surfaceHover: "#262626",
        brand: {
          DEFAULT: "#70B21D", // extracted logo green — CTAs, badges, active states
          dark: "#5A8E17",
          light: "#8ED12F",
        },
        ink: "#FFFFFF", // headings
        muted: "#A1A1AA", // metadata / secondary text
        border: "#2A2A2A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(112,178,29,0.4), 0 0 24px -4px rgba(112,178,29,0.5)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.25s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
