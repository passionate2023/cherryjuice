/*eslint @typescript-eslint/no-var-requires:0*/
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  // testEnvironment: 'jsdom',

  // jest.config.js
  // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
  // which contains the path mapping (ie the `compilerOptions.paths` option):
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
  testPathIgnorePatterns: ['/node_modules/', '/__data__/', '__helpers__','node/__tests__'],
};
