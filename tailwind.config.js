/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerge: {
          50: '#f4f7fa',
          100: '#e8edf3',
          200: '#cbd7e6',
          300: '#9fb7d2',
          400: '#6d93bc',
          500: '#4a74a4',
          600: '#385c88',
          700: '#2e4a6e',
          800: '#283f5c',
          900: '#1b283b',
          950: '#0f1724',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
