module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    amd: true
  },
  plugins: ['jsx-a11y', 'validate-jsx-nesting'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-strict',
    'plugin:astro/base-for-markdown'
  ],
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        'astro/no-set-html-directive': 'error',
        'validate-jsx-nesting/no-invalid-jsx-nesting': 'error',
        'astro/jsx-a11y/click-events-have-key-events': 'off',
        'astro/jsx-a11y/no-static-element-interactions': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }
        ]
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }
        ],
        'astro/no-set-html-directive': 0
      }
    }
  ]
}
