/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          500: '#3b82f6', // bleu original
          600: '#2563eb',
          700: '#1d4ed8'
        },
        dark: {
          bg: '#0b1220',
          card: '#121a2a',
        },
        light: {
          bg: '#f5f7fb',
          card: '#ffffff',
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
}
