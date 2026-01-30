/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        red: {
          500: '#ff0000',
        },
        gray: {
          900: '#1a1a1a',
          400: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
};
