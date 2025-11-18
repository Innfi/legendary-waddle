import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/no-children-prop': 'warn',
      'react/self-closing-comp': 'warn',
      
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/consistent-type-imports': ['warn', {
        prefer: 'type-imports',
      }],
      
      // Import organization
      'import/no-duplicates': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/order': ['warn', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'pathGroups': [
          {
            'pattern': 'react**',
            'group': 'external',
            'position': 'before'
          },
          {
            'pattern': 'dayjs',
            'group': 'external',
            'position': 'before'
          },
          {
            'pattern': '@mui/**',
            'group': 'external',
            'position': 'after'
          },
          {
            'pattern': '@/**',
            'group': 'internal',
            'position': 'before'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
      
      // Accessibility
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
      
      // Code style
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'max-len': ['warn', { 
        'code': 100,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
        'ignoreComments': true
      }],
      'object-curly-newline': ['warn', {
        'ImportDeclaration': {
          'multiline': true,
          'minProperties': 3
        }
      }],
    },
  },
])
