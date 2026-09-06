/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0B2545',
          navy: '#134074',
          saffron: '#F58220',
          green: '#138808'
        },
        tier: {
          mild: '#10B981',
          moderate: '#F59E0B',
          high: '#F97316',
          critical: '#DC2626'
        }
      }
    },
  },
  plugins: [],
};
