/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  dist: path.resolve(__dirname, '../build'),
  index: path.resolve(__dirname, '../src/index.tsx'),
  template: path.resolve(__dirname, '../src/assets/index.html'),
  iconsDist: path.resolve(__dirname, '../build/icons/'),
  icons: path.resolve(__dirname, '../src/assets/icons'),
  serviceWorker: path.resolve(
    __dirname,
    '../src/service-worker/service-worker.ts',
  ),
  env: path.join(__dirname, '../../../.env'),
  src: path.resolve(__dirname, '../src'),
  cypress: path.resolve(__dirname, '../cypress'),
  types: path.resolve(__dirname, '../types'),
  components: path.resolve(__dirname, '../../../libs/components'),
};
