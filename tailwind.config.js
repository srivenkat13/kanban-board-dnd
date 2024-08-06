/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainbg: "#0d1117",
        columnbg: "#161c22",
      },
    },
  },
  plugins: [],
};
