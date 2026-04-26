/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Sora'", "serif"],
        sans: ["'Sora'", "sans-serif"],
        mono: ["'Sora'", "monospace"],
      },
      colors: {
        ink: {
          50: "#ffffff",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        cream: "#ffffff",
        parchment: "#f8fafc",
        accent: {
          DEFAULT: "#4f46e5", /* indigo-600 - FORCED UPDATE */
          light: "#818cf8",
          dark: "#3730a3",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "'Sora', sans-serif",
            h1: { fontFamily: "'Sora', sans-serif" },
            h2: { fontFamily: "'Sora', sans-serif" },
            h3: { fontFamily: "'Sora', sans-serif" },
          },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
