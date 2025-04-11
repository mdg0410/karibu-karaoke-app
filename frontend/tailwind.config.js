/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        karaoke: {
          black: '#121212',
          darkgray: '#1E1E1E', 
          gray: '#2A2A2A',
          lightgray: '#3A3A3A',
          gold: '#D4AF37',
          goldLight: '#F4CF47',
          navy: '#0A1D3B',
          navyLight: '#152D4F'
        },
        primary: {
          DEFAULT: '#D4AF37', // Dorado principal
          dark: '#B89520',
          light: '#F4CF47'
        },
        secondary: '#152D4F', // Azul marino
        dark: {
          DEFAULT: '#121212', // Negro
          card: '#1E1E1E',    // Gris oscuro para tarjetas
          secondary: '#2A2A2A' // Gris medio
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px rgba(0, 0, 0, 0.6)',
        'brutal-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
        // Sombras neumórficas
        'neumorph': '5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(68, 68, 68, 0.2)',
        'neumorph-lg': '10px 10px 20px rgba(0, 0, 0, 0.5), -10px -10px 20px rgba(68, 68, 68, 0.2)',
        'neumorph-inset': 'inset 5px 5px 10px rgba(0, 0, 0, 0.5), inset -5px -5px 10px rgba(68, 68, 68, 0.2)',
        'neumorph-gold': '5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(212, 175, 55, 0.2)',
        'neumorph-gold-inset': 'inset 5px 5px 10px rgba(0, 0, 0, 0.5), inset -5px -5px 10px rgba(212, 175, 55, 0.2)'
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
