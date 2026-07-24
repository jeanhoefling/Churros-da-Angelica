/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/**/*.js",
  ],
  theme: {
    // Breakpoints iguais aos do projeto original:
    // mobile: < 769px | tablet: 769px–1080px | desktop: >= 1081px
    screens: {
      md: "769px",
      lg: "1081px",
    },
    extend: {
      colors: {
        "marrom-escuro": "#411f0b",
        "marrom-texto": "#553a2c",
        rosa: "#fd7381",
        "rosa-escuro": "#a65159",
        "fundo-claro": "#f7f3ee",
        "fundo-creme": "#fcf8f4",
        borda: "#dcd5cc",
      },
      fontFamily: {
        heading: ['"Baloo 2"', "sans-serif"],
        body: ['"Nunito Sans"', "sans-serif"],
      },
      boxShadow: {
        "brand-sm": "0 2px 8px rgba(65, 31, 11, 0.08)",
        "brand-md": "0 8px 24px rgba(65, 31, 11, 0.12)",
        "brand-lg": "0 14px 34px rgba(65, 31, 11, 0.16)",
      },
      keyframes: {
        aparecer: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        subir: {
          "0%": { opacity: 0, transform: "translateY(80%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        aparecer: "aparecer 1s ease forwards",
        subir: "subir 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};
