/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        gold: '#D4AF37',
        blue: '#3A7CA5',
        'light-gray': '#F5F5F5',
        'dark-gray': '#2A2A2A',
        cream: '#F8F4E9',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'elegant-fade-in': 'elegantFadeIn 1.5s ease-out 0.5s forwards',
        'fade-out': 'fadeOut 1s ease-out 2.5s forwards',
        'progress-load': 'progressLoad 2s ease-out forwards',
        'swipe-down': 'swipeDown 2s ease-in-out infinite',
        'fade-in-out': 'fadeInOut 2s ease-in-out infinite',
      },
      keyframes: {
        elegantFadeIn: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          to: { opacity: 0, visibility: 'hidden' },
        },
        progressLoad: {
          to: { width: '100%' },
        },
        swipeDown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
}