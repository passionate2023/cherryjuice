/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'production';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new FaviconsWebpackPlugin({
      logo: './src/assets/icons/material/cherry-juice.svg',
      mode: 'webapp',
      favicons: {
        appName: 'CherryJuice',
        appDescription: 'Start building your knowledge base',
        background: '#180101',
        theme_color: '#180101',
      },
    }),
    new CompressionPlugin({
      deleteOriginalAssets: true,
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|svg)$/,
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  ],
});
