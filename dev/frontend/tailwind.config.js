/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      geoeves: ["Geoeves", "sans-serif"],
    },
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light"
  }
}

