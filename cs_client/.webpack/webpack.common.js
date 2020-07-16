/* eslint-disable @typescript-eslint/no-var-requires */
const { alias, globalStyles, paths } = require('./variables');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const production = process.env.NODE_ENV === 'production';
const styleLoader = production ? MiniCssExtractPlugin.loader : 'style-loader';
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
      '.svg',
    ],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: 'WorkerName.[hash].js',
            inline: true,
            publicPath: '/workers/',
          },
        },
      },
      {
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react', '@babel/typescript'],
              plugins: [
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-class-properties',
                [
                  '@babel/plugin-transform-runtime',
                  { regenerator: true, runtime: true },
                ],
              ],
            },
          },
        ],
        include: paths.src,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader',
        },
      },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'dashes',
              importLoaders: 2,
              modules: {
                localIdentName: production ? '[hash:base64]' : '[local]',
              },
              esModule: true,
            },
          },
          'sass-loader',
        ],
        exclude: globalStyles,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          styleLoader,
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
    production && new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
    }),
    new CopyPlugin([{ from: paths.icons, to: paths.iconsDist }]),
  ].filter(Boolean),
};
