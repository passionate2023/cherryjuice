/*eslint @typescript-eslint/no-var-requires:0*/
// eslint-disable-next-line no-undef
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// eslint-disable-next-line no-undef
const tsconfig = require('./tsconfig');
// eslint-disable-next-line no-undef
module.exports = {
  roots: [/*'<rootDir>/.storybook', */ '<rootDir>/src'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',

  // jest.config.js
  // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
  // which contains the path mapping (ie the `compilerOptions.paths` option):
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      babelConfig: false,
      diagnostics: {
        warnOnly: true,
      },
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
  testPathIgnorePatterns: ['/__data__/', '/__tests__/data/', '__helpers__'],
};
