const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', "sans-serif"],
        'Outfit': ['Outfit', "sans-serif"],
        'Poppins': ['Poppins', "sans-serif"]
      },
    },
  },
  plugins: [],
});