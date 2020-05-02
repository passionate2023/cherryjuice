/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    index: '',
    historyApiFallback: true,
    port: 1236,
    open: false,
    hot: true,
    compress: false,
    stats: 'errors-only',
    overlay: true,
    writeToDisk: true,
  },
  plugins: [new Dotenv({ path: path.join(__dirname, '../.env') })],
});
