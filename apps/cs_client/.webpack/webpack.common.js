/* eslint-disable @typescript-eslint/no-var-requires */

const { alias, globalStyles, paths } = require('./variables');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const production = process.env.NODE_ENV === 'production';
const styleLoader = production ? MiniCssExtractPlugin.loader : 'style-loader';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
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
      !production && {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
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
        test: /\.(mjs|js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: '>2%',
                  },
                ],
                '@babel/react',
                '@babel/typescript',
              ],
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
                includePaths: ['node_modules', '../../node_modules'],
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
    new CopyPlugin([{ from: paths.icons, to: paths.iconsDist }]),
    production && new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
      meta: { 'build-date': new Date().toUTCString() },
    }),
    production &&
      new FaviconsWebpackPlugin({
        logo: './src/assets/icons/material/cherry-juice.svg',
        mode: 'webapp',
        favicons: {
          appName: 'CherryJuice',
          appDescription: 'Start building your knowledge base',
          developerName: 'ycnmhd',
          developerURL: 'https://github.com/ycnmhd',
          lang: 'en-US',
          background: '#180101',
          theme_color: '#180101',
          orientation: 'portrait',
          start_url: '/',
          icons: {
            favicons: true,
            android: true,
            windows: true,
            appleIcon: false, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            firefox: false, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            yandex: false, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
          },
        },
      }),
    production &&
      new WorkboxPlugin.InjectManifest({
        swSrc: paths.serviceWorker,
        maximumFileSizeToCacheInBytes: production ? 1024 * 2000 : 1024 * 20000,
        swDest: 'workbox-sw.js',
      }),
    production &&
      new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    production &&
      new CompressionPlugin({
        // deleteOriginalAssets: true,
        filename: '[path].br[query]',
        algorithm: 'brotliCompress',
        test: /\.(js|css|svg)$/,
      }),
  ].filter(Boolean),
};
