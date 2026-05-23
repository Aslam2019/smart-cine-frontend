/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#E8192C', dark: '#B01020', glow: 'rgba(232,25,44,0.3)' },
        gold: { DEFAULT: '#F5C842', dim: '#C4970A' },
        dark: {
          bg: '#0A0A0F', bg2: '#111118', bg3: '#1A1A24', bg4: '#22222E',
          border: 'rgba(255,255,255,0.08)', border2: 'rgba(255,255,255,0.15)'
        }
      },
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'],
        body: ["'Outfit'", 'sans-serif'],
        serif: ["'Playfair Display'", 'serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'pulse-dot': 'pulseDot 2s infinite',
        'grid-move': 'gridMove 20s linear infinite',
        'scroll-line': 'scrollAnim 2s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
        'bounce-in': 'bounceIn 0.6s ease'
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(1.5)' } },
        gridMove: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(60px)' } },
        scrollAnim: { '0%,100%': { transform: 'scaleY(1)', opacity: '1' }, '50%': { transform: 'scaleY(0.5)', opacity: '0.5' } },
        bounceIn: { '0%': { transform: 'scale(0)' }, '70%': { transform: 'scale(1.2)' }, '100%': { transform: 'scale(1)' } }
      },
      backdropBlur: { xs: '4px' }
    }
  },
  plugins: []
}
