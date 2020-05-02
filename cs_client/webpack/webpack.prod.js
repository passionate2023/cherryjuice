/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// const TerserWebpackPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = merge(common, {
  // mode: 'production',
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    // new CompressionPlugin({
    //   deleteOriginalAssets: true,
    //   filename: '[path].br[query]',
    //   algorithm: 'brotliCompress',
    //   test: /\.(js|css|svg)$/,
    // }),
  ],
});
