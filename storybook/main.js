/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'development';
process.env.STORYBOOK = 'true';
const merge = require('webpack-merge');
const common = require('../apps/cs_client/.webpack/webpack.common.js');
module.exports = {
  stories: [
    '../apps/cs_client/src/**/*.stories.tsx',
    '../libs/components/src/**/*.stories.tsx',
  ],

  webpackFinal: async config => {
    return merge(common, config);
  },
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-controls',
    '@storybook/addon-toolbars',
    'storybook-mobile',
  ],
};
