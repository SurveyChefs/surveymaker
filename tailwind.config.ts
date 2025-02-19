// tailwind.config.js
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        purple: {
          600: "#5941BE",
          700: "#453394",
        },
        gray: {
          700: "#2D3748",
          800: "#1A202C",
          900: "#0a0a0a",
        },
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;