/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'canva-cloud': 'var(--bg-main)',
        'electric-blue': 'var(--primary)',
        navy: 'var(--secondary)',
        grox: {
          teal: 'var(--grox-teal)',
          navy: 'var(--grox-navy)',
        }
      }
    }
  },
  plugins: []
};
