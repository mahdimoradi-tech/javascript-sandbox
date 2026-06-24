/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      keyframes:{
        fadeIn:{
          '0%':{
            top: 0, opacity: 0
          },
          '100%':{
            top: "20px", opacity: 1
          }
        },

        fadeOut: {
          '0%': {
            top: '20px', opacity: 1
          },
          '100%': {
            top: 0, opacity: 0
          }
        }
      },
      animation:{
        slildeDownToast: 'fadeIn 0.3s, fadeOut 0.3s 2.5s'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

