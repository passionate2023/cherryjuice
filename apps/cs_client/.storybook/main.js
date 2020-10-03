process.env.NODE_ENV = 'development';
const path = require('path');
const merge = require('webpack-merge');
const common = require('../.webpack/webpack.common.js');
module.exports = {
  stories: ['../src/**/*.stories.tsx'],

  webpackFinal: async (config, { configType }) => {
    return merge(common, config);
  },
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport/register',
    '@storybook/addon-backgrounds/register',
  ],
};
