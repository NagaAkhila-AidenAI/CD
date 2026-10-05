// ESLint config used by `npm run buildComponent` (DXCB lints each component before bundling).
// A trimmed version of the eslint.config.mjs in Pega's DXCB project template: same recommended
// JavaScript + TypeScript rule sets, without the Storybook / Jest / Sonar plugins this project doesn't use.
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  globalIgnores(['**/node_modules', 'dist/*', 'lib/*', 'keys/*', '**/*.json', '**/*.svg', '**/*.d.ts', '**/*.mjs']),
  {
    languageOptions: {
      globals: {
        PCore: 'readonly',
        window: 'readonly',
        console: 'readonly',
        document: 'readonly',
        fetch: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-empty': 'off',
      'no-console': 'off',
      'no-nested-ternary': 'error',
      'prefer-template': 'error',
      radix: 'error'
    }
  }
]);
