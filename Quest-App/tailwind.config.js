/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: "#0f172a",
          card: "#1e293b",
          xp: "#facc15",
          xpEnd: "#f97316",
        },
      },
    },
  },
  plugins: [],
};
