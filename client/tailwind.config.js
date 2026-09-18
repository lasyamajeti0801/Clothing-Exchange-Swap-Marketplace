/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f5',
          100: '#e5ece7',
          200: '#ccdad0',
          300: '#a6c0b0',
          400: '#7ba28c',
          500: '#5a866d',
          600: '#436b54',
          700: '#345543',
          800: '#2b4437',
          900: '#1E3A2F', // Forest Green
          950: '#12231c',
        },
        sage: {
          light: '#BDCFC6',
          DEFAULT: '#8FA89B',
          dark: '#6A8878',
        },
        terracotta: {
          light: '#D98973',
          DEFAULT: '#C26D54',
          dark: '#9F513C',
        },
        cream: {
          50: '#FDFAF7',
          100: '#FAF7F2',
          200: '#F4EFEA',
          300: '#EAE2D8',
          400: '#DDD2C3',
          500: '#C7B9A5',
        },
        charcoal: {
          light: '#3C4441',
          DEFAULT: '#1F2421',
          dark: '#141816',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
