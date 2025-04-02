/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5F3E',
          dark: '#E04530',
          light: '#FF7D62'
        },
        secondary: '#FFCB45', 
        dark: {
          DEFAULT: '#181818',
          card: '#242424',
          secondary: '#2A2A2A'
        },
        "dark-card": "#141414",    // card background
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px rgba(0, 0, 0, 0.6)',
        'brutal-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-out': 'fadeOut 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
