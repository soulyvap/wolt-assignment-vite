/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "wolt-blue": "#00c2e8",
      },
      fontFamily: {
        omnes: ["Omnes", "sans-serif"],
      },
      boxShadow: {
        intense: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
      },
      animation: {
        "bounce-delay-1": "bounce 1s linear infinite 200ms",
        "bounce-delay-2": "bounce 1s linear infinite 400ms",
      },
    },
  },
  plugins: [],
};
