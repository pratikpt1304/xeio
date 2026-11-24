/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: '#141413',
        paper: '#F4F3EF',
        surface: '#FFFFFF',
        'surface-alt': '#FBFAF7',
        border: '#E2E0D8',
        ink: '#141413',
        muted: '#6B6A63',
        teal: {
          DEFAULT: '#0E5E52',
          tint: '#E6F0EC',
        },
        assist: {
          DEFAULT: '#C2410C',
          tint: '#FFF1E8',
        },
        danger: {
          DEFAULT: '#9F1D1D',
          tint: '#FBEAEA',
        },
        brand: {
          blueDark: '#3FA9F5',
          blueLight: '#1F5FE0',
        },
        editor: '#1B1B1A',
        console: '#11110F',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['"IBM Plex Serif"', 'serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '8px',
      },
      boxShadow: {
        none: 'none',
      }
    },
  },
  plugins: [],
}
