/*eslint @typescript-eslint/no-var-requires:0*/
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__data__/',
    '/__assertions__/',
    '/__preparations__/',
    '__helpers__',
    'node/__tests__',
  ],
};
