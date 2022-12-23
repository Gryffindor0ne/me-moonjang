/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Lora: ['Lora', 'serif'],
        Gowun: ['Gowun Batang', 'serif'],
      },
    },
  },
  variants: {
    outline: ['focus'],
  },
  plugins: [require('@tailwindcss/forms')],
};
