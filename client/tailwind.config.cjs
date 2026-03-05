/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #1f1f2e, #111827)", 
      },
      colors: {
        primary: "#1E3A8A",
        secondary: "#9333EA",
      },
    },
  },
  plugins: [],
};