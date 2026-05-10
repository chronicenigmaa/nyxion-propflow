/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        brand: {
          50:  "#EBF5FF",
          100: "#BFDBFE",
          500: "#1C64F2",
          600: "#1A56DB",
        },
      },
    },
  },
  plugins: [],
};
