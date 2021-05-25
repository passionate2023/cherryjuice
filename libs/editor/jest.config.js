/*eslint @typescript-eslint/no-var-requires:0*/
// eslint-disable-next-line no-undef
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// eslint-disable-next-line no-undef
const tsconfig = require('./tsconfig');
const config = require('../../config/jest/jest.config');
// eslint-disable-next-line no-undef
module.exports = {
  ...config,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
};
