/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom gunmetal dark theme colors
        gunmetal: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#020617',
        },
        // Sepia-tinted whites for blue-light friendliness
        sepia: {
          50: '#fefcf8',
          100: '#fdf9f1',
          200: '#fbf4e6',
          300: '#f8eed9',
          400: '#f4e6c7',
          500: '#f0ddb5',
          600: '#e8d0a0',
          700: '#dfc08a',
          800: '#d4b074',
          900: '#c8a05e',
        },
        dark: {
          bg: '#0a0f1c',
          surface: '#111827',
          card: '#1a202c',
          border: '#2d3748',
          text: {
            primary: '#f7fafc',
            secondary: '#e2e8f0',
            muted: '#a0aec0',
          }
        }
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #1a202c 100%)',
        'sepia-gradient': 'linear-gradient(135deg, #fefcf8 0%, #fdf9f1 50%, #fbf4e6 100%)',
      }
    },
  },
  plugins: [],
};