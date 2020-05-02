/* eslint-disable @typescript-eslint/no-var-requires */
const { alias, globalStyles, paths } = require('./variables');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: {
    index: './src/index.tsx',
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
    ],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: { babelrc: true },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(graphql|gql|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 2, modules: true, esModule: true },
            // options: { modules: true },
          },

          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: paths.postCssConfig,
              },
            },
          },
          'sass-loader',
        ],
        exclude: globalStyles,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules'],
              },
            },
          },
        ],
        include: globalStyles,
      },
    ],
  },

  target: 'web',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
    }),
    new CopyPlugin([{ from: paths.icons, to: paths.iconsDist }]),
  ],
};
