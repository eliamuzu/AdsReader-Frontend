/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#105243',
        sidebar: '#474448',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        bitcount: ['Bitcount Grid Single', 'monospace'],
      },
    },
  },
  plugins: [],
}

