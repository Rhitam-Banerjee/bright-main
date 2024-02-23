/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
      colors: {
        mainColorLight: "#DAF0FF",
        mainColor: "#0094FF",
        secondary: "orange",
        unHighlight: "#ECECEC",
        unHighlightLignt: "#ABABAB",
        unHighlightDark: "#7A7A7A",
      },
      boxShadow: {
        customShadowLight: "0 4px 10px rgba(0,0,0,0.4)",
        // customShadow: "0 4px 10px #222",
        // customShadowActive: "0 10px 10px #111",
      },
      screens: {
        xs: { max: "450px" },
        md: { max: "968px" },
      },
    },
  },
  plugins: [],
};
