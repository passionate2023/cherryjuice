// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

const config = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {},
  plugins: [],
  extends: [],
  rules: {},
  settings: {},
};

const add = ({
  plugins = [],
  extends_ = [],
  settings = {},
  rules = {},
  parserOptions = {},
  parser = '',
}) => {
  config.plugins.push(...plugins);
  config.extends.push(...extends_);
  config.settings = {
    ...config.settings,
    ...settings,
  };
  config.rules = {
    ...config.rules,
    ...rules,
  };
  config.parserOptions = {
    ...config.parserOptions,
    ...parserOptions,
  };
  if (parser) {
    config.parser = parser;
  }
};

add({
  extends_: ['eslint:recommended'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'prefer-const': 'warn',
    'no-extra-semi': 'off',
    'comma-dangle': 'off',
    semi: 'off',
    'linebreak-style': 'error',
  },
});

add({
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/naming-convention': 'warn',
    '@typescript-eslint/camelcase': 'off',
  },
  plugins: ['@typescript-eslint'],
  extends_: ['plugin:@typescript-eslint/recommended'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
  },
});

add({
  plugins: ['react', 'react-hooks'],
  extends_: ['plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
  },
});

add({
  plugins: ['eslint-plugin-node'],
  rules: {
    'node/no-extraneous-import': 'error',
  },
});

add({
  extends_: ['plugin:cypress/recommended'],
});

module.exports = config;
