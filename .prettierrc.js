module.exports = {
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        jsxSingleQuote: true,
        trailingComma: "none",
      },
    },
  ],
};
