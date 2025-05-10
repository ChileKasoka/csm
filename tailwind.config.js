/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tagesschrift: ['Tagesschrift', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

