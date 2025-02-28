module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  files: ['src/**/*.{html,js,jsx,md,mdx,ts,tsx}'],
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  jsxSingleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        jsxSingleQuote: true,
        trailingComma: 'none'
      }
    }
  ]
}
