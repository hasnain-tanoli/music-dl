/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          dark: '#191414',
          gray: '#121212',
          light: '#282828'
        },
        premium: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          blue: '#4F46E5',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          purple: '#A855F7',
          pink: '#EC4899',
          rose: '#F43F5E',
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          sky: '#0EA5E9'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'premium-lg': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'premium-xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
        'glow': '0 0 20px rgb(29 185 84 / 0.3)',
        'glow-lg': '0 0 40px rgb(29 185 84 / 0.4)'
      }
    },
  },
  plugins: [],
}