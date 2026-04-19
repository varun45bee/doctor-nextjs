import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cddccd",
          300: "#a8c0a8",
          400: "#7d9f7d",
          500: "#5a7f5a",
          600: "#466546",
          700: "#395139",
          800: "#2f422f",
          900: "#263727",
        },
        cream: {
          50: "#fdfaf5",
          100: "#faf3e6",
          200: "#f4e4c8",
          300: "#a8d4c0",
          400: "#7ab8a0",
          500: "#5a9e8a",
        },
        teal: {
          400: "#4db6a4",
          500: "#3a9e8c",
          600: "#2e8070",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        devanagari: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      backgroundImage: {
        "leaf-pattern": "url('/patterns/leaves.svg')",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
