/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = merge(common({ production: true }), {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new CompressionPlugin({
      deleteOriginalAssets: true,
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|svg)$/,
    }),
  ],
});
