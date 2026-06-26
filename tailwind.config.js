/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#111118',
          card: '#1a1a24',
          overlay: 'rgba(10,10,15,0.85)',
        },
        accent: {
          green: '#46d369',
          blue: '#0071eb',
          white: '#ffffff',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a3a3b3',
          muted: '#6b6b7e',
          match: '#46d369',
        },
        nav: {
          bg: 'rgba(10,10,15,0.95)',
          hover: 'rgba(255,255,255,0.1)',
          active: 'rgba(255,255,255,0.15)',
        },
        focus: {
          ring: '#ffffff',
          bg: 'rgba(255,255,255,0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem,5vw,5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-sm': ['clamp(1.5rem,3vw,2.5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        'nav-w': '72px',
        'nav-w-open': '220px',
      },
      transitionDuration: {
        '350': '350ms',
      },
      boxShadow: {
        'card-focus': '0 0 0 3px #ffffff, 0 0 0 5px rgba(255,255,255,0.2)',
        'hero': 'inset 0 0 0 100vmax rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'hero-grad': 'linear-gradient(to right, rgba(10,10,15,0.95) 35%, rgba(10,10,15,0.6) 60%, transparent 100%)',
        'hero-bottom': 'linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.5) 30%, transparent 60%)',
        'card-grad': 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeInUp: 'fadeInUp 0.5s ease forwards',
      },
      aspectRatio: {
        '16/9': '16 / 9',
        '2/3': '2 / 3',
      },
    },
  },
  plugins: [],
};
