/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#f4f4f9',
        foreground: '#e3e3e3',
        text: '#000000',
        border: '#6c7dff',
        button: {
          default: '#f4f4f9',
          hover: '#5a6bdb',
          active: '#4a5abf',
        },
      },
      screens: {
        'xs': {'max': '480px'},
        'sm': '640px',
      },
    },
  },
  plugins: [],
};
