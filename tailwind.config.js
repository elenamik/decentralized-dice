/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["Poppins", "sans-serif"], -> add google font to script
      },
      colors: {
        // "bright-blue-1": "#437CF8",
        // "bright-blue-2": "#46EEE9",
        // "grey-1": "#C4C4C4",
        // "black-1": "#1B1D3D",
      },
    },
  },
  plugins: [],
};
