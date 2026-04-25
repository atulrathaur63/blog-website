/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f7f6f3",
          100: "#edeae3",
          200: "#d8d3c7",
          300: "#bdb4a2",
          400: "#a0937b",
          500: "#8a7c63",
          600: "#7a6c55",
          700: "#655847",
          800: "#534940",
          900: "#463e38",
          950: "#2a2520",
        },
        cream: "#faf8f4",
        parchment: "#f2ede4",
        accent: {
          DEFAULT: "#c84b31",
          light: "#e8634d",
          dark: "#a83822",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "'DM Sans', system-ui, sans-serif",
            h1: { fontFamily: "'Playfair Display', serif" },
            h2: { fontFamily: "'Playfair Display', serif" },
            h3: { fontFamily: "'Playfair Display', serif" },
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
