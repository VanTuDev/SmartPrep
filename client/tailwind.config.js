/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#3e4a8a',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
