/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Alexandria", "sans-serif"],
      },
      colors: {
        proofpix: {
          yellow: "#FFE89A",
          gold: "#F5C54B",
          black: "#111111",
        },
      },
    },
  },
  plugins: [],
};

