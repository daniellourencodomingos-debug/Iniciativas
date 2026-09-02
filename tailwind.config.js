/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3468A4',
          dark: '#2B568A',
          light: '#EAF1F9',
        },
        pagebg: '#F5F5F5',
        hairline: '#E0E0E0',
        attention: {
          bg: '#FDF3E3',
          border: '#F0D9A8',
          text: '#8A5A00',
        },
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
