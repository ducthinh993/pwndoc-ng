module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:tailwindcss/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    'tailwindcss',
  ],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/script-setup-uses-vars': 'error',
    
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Tailwind specific rules - CRITICAL for style consistency
    'tailwindcss/classnames-order': 'error',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for design tokens
    'tailwindcss/no-custom-classname': 'off', // Allow custom classes for legacy compatibility
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    
    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // Disabled in favor of TypeScript rule
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    
    // Import/export rules
    'import/no-unresolved': 'off', // Handled by TypeScript
    'import/named': 'off', // Handled by TypeScript
    'import/default': 'off', // Handled by TypeScript
    'import/namespace': 'off', // Handled by TypeScript
  },
  settings: {
    tailwindcss: {
      // These options are passed to the loadConfig() function
      config: './tailwind.config.js',
      // Set to `true` to enable file-based configuration
      cssFiles: [
        './src/styles/globals.css',
        './src/styles/components.css',
      ],
      // Set to `false` to disable the plugin
      removeDuplicates: true,
      // Set to `false` to disable the plugin for specific files
      skipClassAttribute: false,
      // Set to `[]` to disable the plugin for specific class attributes
      whitelist: [],
      // Set to `[]` to disable the plugin for specific HTML tags
      tags: [],
      // Set to `{}` to disable the plugin for specific classRegex
      classRegex: '^class(Name)?$',
    },
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Vue specific overrides
        'vue/component-tags-order': [
          'error',
          {
            order: ['template', 'script', 'style'],
          },
        ],
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          {
            registeredComponentsOnly: false,
          },
        ],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineProps', 'defineEmits'],
          },
        ],
        'vue/html-self-closing': [
          'error',
          {
            html: {
              void: 'always',
              normal: 'always',
              component: 'always',
            },
            svg: 'always',
            math: 'always',
          },
        ],
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: 3,
            multiline: 1,
          },
        ],
        'vue/order-in-components': [
          'error',
          {
            order: [
              'el',
              'name',
              'parent',
              'functional',
              ['delimiters', 'comments'],
              ['components', 'directives', 'filters'],
              'extends',
              'mixins',
              'inheritAttrs',
              'model',
              ['props', 'propsData'],
              'fetch',
              'asyncData',
              'data',
              'computed',
              'watch',
              'LIFECYCLE_HOOKS',
              'methods',
              'head',
              ['template', 'render'],
              'renderError',
            ],
          },
        ],
        'vue/v-on-event-hyphenation': ['error', 'always'],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript specific overrides
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
      },
    },
  ],
} 