/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'production';
const paths = require('./paths');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const [head, ...tail] = common.plugins;
module.exports = merge(common, {
  mode: 'production',
  stats: 'errors-only',
  plugins: [
    head,
    new MiniCssExtractPlugin(),
    ...tail,
    new webpack.EnvironmentPlugin(['COMMIT_SHA', 'BUILD_DATE']),
    new WorkboxPlugin.InjectManifest({
      swSrc: paths.serviceWorker,
      maximumFileSizeToCacheInBytes: 1024 * 2000, // production ? 1024 * 2000 : 1024 * 20000,
      swDest: 'workbox-sw.js',
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new CompressionPlugin({
      // deleteOriginalAssets: true,
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|svg)$/,
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg)$/,
      minRatio: Number.MAX_SAFE_INTEGER,
    }),
    new FaviconsWebpackPlugin({
      logo: '../../libs/icons/src/assets/icons/material/cherry-juice.svg',
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
  ],
});
