/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  dist: path.resolve(__dirname, '../dist'),
  index: path.resolve(__dirname, '../src/index.tsx'),
  template: path.resolve(__dirname, '../src/assets/index.html'),
  serviceWorker: path.resolve(
    __dirname,
    '../src/service-worker/service-worker.ts',
  ),
  env: undefined /*path.join(__dirname, '../.env')*/,
  src: path.resolve(__dirname, '../src'),
  cypress: path.resolve(__dirname, '../cypress'),
  types: path.resolve(__dirname, '../types'),
};
