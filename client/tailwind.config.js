const colors = require("tailwindcss/colors");
const { colors: defaultColors } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"Inter"', "sans-serif"],
    },
    colors: {
      ...defaultColors,
      rose: colors.rose,
      fuchsia: colors.fuchsia,
      indigo: colors.indigo,
      teal: colors.teal,
      emerald: colors.emerald,
      sky: colors.sky,
      lime: colors.lime,
      orange: colors.orange,
      cyan: colors.cyan,
    },
  },
  variants: {
    extend: {
      fontWeight: ["hover", "focus"],
      display: ["group-hover"],
      margin: ["first", "last"],
    },
  },
  plugins: [require("daisyui")],
};
