/* eslint-disable @typescript-eslint/no-var-requires */

const alias = require('./alias');
const paths = require('./paths');
const rules = require('./rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: paths.index,
  },
  output: {
    path: paths.dist,
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: [
      '*',
      '.mjs',
      '.json',
      '.gql',
      '.graphql',
      '.tsx',
      '.ts',
      '.js',
      '.scss',
      '.svg',
    ],
    alias,
  },
  module: {
    rules: Object.values(rules),
  },
  target: 'web',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.template,
      meta: { 'build-date': new Date().toUTCString() },
    }),
    new CopyPlugin([{ from: paths.icons, to: paths.iconsDist }]),
  ].filter(Boolean),
};
