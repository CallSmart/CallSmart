/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "prim-blue": "#0066CC",
      "sec-blue": "#2E3541",
      "grey-light": "#F5F5F5",
      white: "#FFFFFF",
      black: "#000000",
    },
    extend: {},
  },
  plugins: [],
};
