/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',

  mode: 'development',
  devtool: 'inline-source-map',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: ['swc-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.mjs, .tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
    new webpack.HotModuleReplacementPlugin(),
    new RunScriptWebpackPlugin({ name: 'main.js' }),
  ],
};
