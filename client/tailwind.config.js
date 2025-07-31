/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        quote: ['"Libre Baskerville"', 'serif'],
      },
      colors: {
        base: '#111111',
        primary: '#E50914',
        accent: '#1D4ED8',
        background: '#FAF9F6',
      },
    },
  },
  plugins: [lineClamp],
};
