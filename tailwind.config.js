/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray1: 'rgb(51, 51, 51)',
        gray2: 'rgb(96, 96, 96)',
        blue1: 'rgb(241, 241, 251)',

      },
    },
  },
  plugins: [],
};
