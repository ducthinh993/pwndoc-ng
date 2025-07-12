import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tailwindcss from 'eslint-plugin-tailwindcss'
import { resolve } from 'path'

export default [
  js.configs.recommended,
  
  // Vue.js configuration
  ...vue.configs['flat/recommended'],
  
  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    rules: {
      // General rules
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'never'],
      'indent': ['error', 2],
      'eol-last': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'comma-spacing': 'error',
      'key-spacing': 'error',
      'func-call-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'error',
      'no-duplicate-imports': 'error',
    },
  },
  
  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off', // Handled by TypeScript
    },
  },
  
  // Vue.js configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: {
          ts: tsParser,
        },
      },
    },
    rules: {
      // Vue-specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-mutating-props': 'error',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'ignore',
        multiline: 'below',
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',
      }],
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, { baseIndent: 0 }],
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'indent': 'off', // Handled by vue/script-indent
    },
  },
  
  // Tailwind CSS configuration
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    plugins: {
      tailwindcss,
    },
    rules: {
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off', // Allow custom classes for migration
      'tailwindcss/no-contradicting-classname': 'error',
    },
    settings: {
      tailwindcss: {
        config: resolve('./tailwind.config.js'),
        cssFiles: [
          'src/styles/**/*.css',
          'src/**/*.vue',
        ],
        whitelist: [
          // Design token classes
          'bg-success-subtle',
          'bg-warning-subtle',
          'bg-error-subtle',
          'bg-info-subtle',
          'text-success-strong',
          'text-warning-strong',
          'text-error-strong',
          'text-info-strong',
          'border-success-emphasis',
          'border-warning-emphasis',
          'border-error-emphasis',
          'border-info-emphasis',
          'bg-diff-added',
          'bg-diff-removed',
          'bg-diff-changed',
          'border-diff-added',
          'border-diff-removed',
          'border-diff-changed',
          'bg-layout-background',
          'bg-layout-surface',
          'border-layout',
          // Dynamic CSS Grid classes
          'col-span-1',
          'col-span-2',
          'col-span-3',
          'col-span-4',
          'col-span-5',
          'col-span-6',
          'col-span-7',
          'col-span-8',
          'col-span-9',
          'col-span-10',
          'col-span-11',
          'col-span-12',
          'col-start-1',
          'col-start-2',
          'col-start-3',
          'col-start-4',
          'col-start-5',
          'col-start-6',
          'col-start-7',
          'col-start-8',
          'col-start-9',
          'col-start-10',
          'col-start-11',
          'col-start-12',
          // Editor classes
          'ProseMirror',
          'tiptap',
          'collaboration-cursor__caret',
          'collaboration-cursor__label',
          'editor-bubble-menu',
          'editor-toolbar',
          'diffrem',
          'diffadd',
          'lt',
          'lt-style',
          'lt-typographical',
          'lt-grammar',
          'lt-misspelling',
          // Legacy classes
          'scoreRating',
          'baseSeverity',
          'baseMetricScore',
          'cvsscalculator',
          'affix',
          'affix-relative-element',
          'home-background',
        ],
      },
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
      'public/**',
      'docs/**',
      '.quasar/**',
    ],
  },
] 