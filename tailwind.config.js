/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#E6F1FB', 100:'#B5D4F4', 200:'#85B7EB',
          400:'#378ADD', 600:'#185FA5', 700:'#0F4A82',
          800:'#0C447C', 900:'#042C53',
        },
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
}
