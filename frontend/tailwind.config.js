/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        base: {
          950: '#09090E',
          900: '#0F1017',
          800: '#16171F',
          700: '#1E2029',
          600: '#282A35',
          500: '#363848',
        },
        amber: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        slate: {
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(251,191,36,0.15)',
      }
    },
  },
  plugins: [],
}