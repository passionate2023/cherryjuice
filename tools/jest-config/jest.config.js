const resolver = '<rootDir>/../../tools/jest-config/jest-resolver';
// eslint-disable-next-line no-undef
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testPathIgnorePatterns: [
    '/__data__/',
    '/__tests__/data/',
    '__helpers__',
    '/node_modules/',
    '/__data__/',
    '/__assertions__/',
    '/__preparations__/',

    'node/__tests__',
  ],
  transformIgnorePatterns: ['/node_modules/(?!@cherryjuice)'],
  resolver: resolver,
};
