const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const babelParser = require('@babel/eslint-parser');

module.exports = [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'client/dist/',
      'server/public/assets/',
      'server/public/',
      '*.min.js',
      '*.bundle.js',
    ],
  },
  // Node.js backend
  {
    files: ['server/**/*.js', 'server/**/*.cjs', 'server/**/*.mjs', 'server/**/*.ts', 'server/**/*.json', 'server/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    ...js.configs.recommended,
  },
  // React frontend
  {
    files: ['client/src/**/*.jsx', 'client/src/**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-react'] },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
    },
  },
];
