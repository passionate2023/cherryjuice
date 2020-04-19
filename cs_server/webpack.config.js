const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
module.exports = {
  watch: true,
  mode: "development",
  devtool: "inline-source-map",
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new NodemonPlugin(),
  ]
};
