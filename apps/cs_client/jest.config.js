/*eslint @typescript-eslint/no-var-requires:0*/
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const tsconfig = require('./tsconfig');
module.exports = {
  roots: [/*'<rootDir>/.storybook', */ '<rootDir>/src', '<rootDir>/cypress'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',

  // jest.config.js
  // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
  // which contains the path mapping (ie the `compilerOptions.paths` option):
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        ...tsconfig.compilerOptions,
        target: 'es6',
        allowJs: true,
      },
      babelConfig: false,
    },
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  testPathIgnorePatterns: ['/node_modules/', '/__data__/' , '/__tests__/data/' , '__helpers__'],
};
