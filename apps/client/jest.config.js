/*eslint @typescript-eslint/no-var-requires:0*/
// eslint-disable-next-line no-undef
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const config = require('jest-config');
// eslint-disable-next-line no-undef
const tsconfig = require('./tsconfig');

// eslint-disable-next-line no-undef
module.exports = {
  ...config,
  roots: [/*'<rootDir>/.storybook', */ '<rootDir>/src', '<rootDir>/cypress'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  testEnvironment: 'jsdom',
};
