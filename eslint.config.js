/* eslint-env node */

const globals = require('globals')
const pluginJs = require('@eslint/js')
const stylisticJs = require('@stylistic/eslint-plugin-js')
const babelParser = require('@babel/eslint-parser')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y')
const vitestGlobals = require('eslint-plugin-vitest-globals')

module.exports = [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly', // Node.js global variable
      },
      ecmaVersion: 'latest',
      sourceType: 'script', // Use 'script' for backend files
    },
    files: ['backend/**/*.js'],
    plugins: {
      '@stylistic/js': stylisticJs,
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-console': 'warn',
      //* Avoid Bugs
      'no-undef': 'error',
      semi: ['error', 'never'],
      'semi-spacing': 'error',
      //* Best Practices
      eqeqeq: 'warn',
      'no-invalid-this': 'error',
      'no-return-assign': 'error',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-constant-condition': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next|__' }],
      //* Enhance Readability
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-mixed-spaces-and-tabs': 'warn',
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      quotes: ['error', 'single'],
      //
      'max-len': ['error', { code: 200 }],
      'max-lines': ['error', { max: 500 }],
      'keyword-spacing': 'error',
      'multiline-ternary': ['error', 'never'],
      'no-mixed-operators': 'error',
      //
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-whitespace-before-property': 'error',
      'nonblock-statement-body-position': 'error',
      'object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      // Add Prettier rules
      'prettier/prettier': ['error', { 
        semi: false,
        endOfLine: 'auto',
        tabWidth: 2,
      }],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly', // Recognize browser global variables
      },
      ecmaVersion: 'latest',
      sourceType: 'module', // Use 'module' for frontend files
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        requireConfigFile: false, // Avoid requiring a Babel config file
      },
    },
    files: ['frontend/**/*.jsx'],
    plugins: {
      '@stylistic/js': stylisticJs,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: require('eslint-plugin-prettier'),
      vitest: vitestGlobals,
    },
    rules: {
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
      quotes: ['error', 'single'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      // Add Prettier rules
      'prettier/prettier': ['error', {
        semi: false,
        tabWidth: 2,
        endOfLine: 'auto',
        singleQuote: true
      }],
    },
  },
  {
    ignores: [
      'frontend/dist/**/*',
      'backend/dist/**/*',
      '!node_modules/',
      'node_modules/*',
      'build/**/*',
      'eslint.config.js',
      'testSetup.js',
    ],
  },
]
