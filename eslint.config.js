import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

const tsUnusedVarsRule = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }
  ]
}

export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-strict'],
  {
    files: ['**/*.{ts,tsx}'],
    ...tseslint.configs.recommended[0],
    rules: {
      ...tseslint.configs.recommended[0]?.rules,
      ...tsUnusedVarsRule
    }
  },
  {
    files: ['**/*.astro'],
    rules: {
      'astro/no-set-html-directive': 'error',
      'astro/jsx-a11y/click-events-have-key-events': 'off',
      'astro/jsx-a11y/no-static-element-interactions': 'off',
      ...tsUnusedVarsRule
    }
  }
]
