/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
      colors: {
        mainColorLight: "#D6E2FF",
        mainColor: "#3B72FF",
        secondary: "#ff9f30",
        secondaryLight: "#fff1e0",
        lightGrey: "#f5f5f5",
        unHighlight: "#ECECEC",
        unHighlightLight: "#ABABAB",
        unHighlightDark: "#7a7a7a",
        successGreen: "#14D027",
        errorRed: "#ff0000",
      },
      boxShadow: {
        customShadowLight: "0 4px 10px rgba(0,0,0,0.4)",
        customShadowDark: "0 4px 20px rgba(0,0,0,0.8)",
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
