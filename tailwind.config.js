/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    daisyui: {
      themes: ["light", "dark", "cupcake", "lemonade", "forest"],
    },
  },
  plugins: [require("daisyui")],
};
