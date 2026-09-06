/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared Base
        ink: '#23303A',
        paper: '#F6F4EF',
        line: '#D9D4C8',

        // Sahay (Victim-Facing) Accents
        sage: {
          DEFAULT: '#6E8E7A',
          light: '#E6EEE8',
          hover: '#5B7A66',
        },
        clay: {
          DEFAULT: '#C98B6C',
          light: '#F8EFEA',
        },
        dusk: {
          DEFAULT: '#4E5B72',
          light: '#ECEEF2',
        },

        // Command View (Official-Facing) Accents
        teal: {
          DEFAULT: '#1F4A48',
          deep: '#153331',
          subtle: '#E8F0EF',
        },
        amberFlag: {
          DEFAULT: '#B98A2B',
          light: '#F8F3E8',
        },
        brickFlag: {
          DEFAULT: '#8C4A3A',
          light: '#F7ECE9',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Devanagari"', 'system-ui', 'sans-serif'],
        serif: ['"Literata"', 'Georgia', 'serif'],
        devanagari: ['"IBM Plex Sans Devanagari"', 'sans-serif'],
      },
      keyframes: {
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        softSettle: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadePulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'draw-line': 'drawLine 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'soft-settle': 'softSettle 350ms ease-out forwards',
        'fade-pulse': 'fadePulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
