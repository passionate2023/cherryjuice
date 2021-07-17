/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'development';
process.env.STORYBOOK = 'true';
process.env.USE_BABEL = 'true';
const merge = require('webpack-merge');
const common = require('../../apps/client/.webpack/webpack.common.js');
module.exports = {
  stories: [
    '../../apps/client/src/**/*.stories.tsx',
    '../../libs/components/src/**/*.stories.tsx',
  ],

  webpackFinal: async config => {
    return merge(common, config);
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        '@storybook/addon-backgrounds': false,
      },
    },
    '@storybook/addon-a11y',
    // '@storybook/addon-knobs',
    '@storybook/addon-storysource',
    // 'storybook-mobile',
    'storybook-addon-designs',
  ],
  typescript: {
    reactDocgen: 'none',
  },
};
