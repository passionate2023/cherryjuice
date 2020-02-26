const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',

  // jest.config.js
  // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
  // which contains the path mapping (ie the `compilerOptions.paths` option):

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
};
