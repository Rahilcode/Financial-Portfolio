/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#06b6d4",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(2,6,23,0.08)",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
