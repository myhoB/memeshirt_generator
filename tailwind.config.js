/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B3954',
        secondary: '#BFD7EA',
        accent: '#C98986',
        text: '#8B575C',
        background: '#FEFFFE',
      },
    },
  },
  plugins: [],
} 