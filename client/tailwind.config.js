/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yt: {
          bg: '#0f0f0f',
          surface: '#212121',
          surfaceHover: '#272727',
          border: '#303030',
          text: '#f1f1f1',
          subtext: '#aaaaaa',
          red: '#ff0000',
          redHover: '#cc0000',
          blue: '#3ea6ff',
          pill: '#272727',
          pillActive: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
