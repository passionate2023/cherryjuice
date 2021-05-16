/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'development';
const paths = require('./paths');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: paths.dist,
    index: '',
    historyApiFallback: true,
    port: 1236,
    open: false,
    hot: true,
    compress: false,
    stats: 'errors-only',
    overlay: true,
    writeToDisk: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
});
