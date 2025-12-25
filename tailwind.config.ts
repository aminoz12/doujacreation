import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          imperial: '#C7A14A',
          champagne: '#E8D8A8',
        },
        luxury: {
          white: '#FFFFFF',
          ivory: '#FAF8F4',
          black: '#0E0E0E',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-cormorant)', 'serif'],
        sans: ['var(--font-inter)', 'var(--font-poppins)', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.05em',
        wide: '0.1em',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config



