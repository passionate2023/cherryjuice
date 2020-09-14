/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'production';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [],
});
