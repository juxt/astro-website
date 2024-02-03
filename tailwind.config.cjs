/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx,json}'],
  theme: {
    extend: {
      fontSize: {
        xs: '0.8rem'
      },
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
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
