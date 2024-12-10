/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%,  90%": {
            transform: "translate(-1px,0)",
            transform: "rotate(-30deg)",
          },
          "20%, 80%": { transform: "translate(1px, 0)" },
        },
      },
      animation: {
        shake: "shake 1s infinite",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(30px)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        sui: ["system-ui", "sans-serif"]
      },
      fontSize: {
        fontadd: '0.9rem',
      },
      colors: {
        glass: "rgba(240, 245, 255, 0.7)",
        bgGray: "#2F2F2F",
        bgBlack: "#1F1F1F",
        name: "#B1B1B1",
        flo: "#106674",
        prime: "#d70008",
        second: "#ebeef5",
        box: "#ffffff",
        label: "#172554",
        login: "#ffffff",
        gcolor: "#ab01ea",
        snow: "#FAFDFF",
        alice: "#F0F8FF",
        scolor: "rgba(0, 66, 255, 0.08)",
      },
      boxShadow: {
        custom: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      },
      height: {
        height: "39.5rem",
      },
    },
    variants: {
      backdropFilter: ["responsive"],
      borderColor: ["focus"],
      ringColor: ["focus"],
    },
  },
  plugins: [],
};
