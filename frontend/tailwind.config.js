/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './services/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B8DEF', // Calm Blue
        secondary: '#BFD7FF', // Sky Blue
        accent: '#4CD4B0', // Mint
        navy: '#1E2A3A', // Navy text
        background: '#FFFFFF'
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'slide-up': 'slide-up 0.8s ease-out'
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};
