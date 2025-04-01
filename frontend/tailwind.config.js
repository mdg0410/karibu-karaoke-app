/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff3c00",        // accent-1 (orange)
        secondary: "#ffde59",      // accent-2 (yellow)
        dark: "#0a0a0a",           // background
        "dark-card": "#141414",    // card background
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      boxShadow: {
        'brutal': '5px 5px 0 rgba(0, 0, 0, 0.8)',
        'brutal-lg': '10px 10px 0 rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
