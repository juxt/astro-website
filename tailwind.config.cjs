/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        juxt: '#f4901d',
        moonlight: '#0b0e14'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch'
          }
        }
      }
    },
    fontSize: {
      xxs: '0.579rem',
      xs: '0.694rem',
      sm: '0.833rem',
      base: '1rem',
      md: '1.2rem',
      lg: '1.44rem',
      xl: '1.728rem',
      '2xl': '2.074rem',
      '3xl': '2.488rem',
      '4xl': '2.986rem',
      '5xl': '3.583rem',
      '6xl': '4.3rem',
      '7xl': '5.16rem'
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
