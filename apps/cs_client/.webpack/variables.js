/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

module.exports = {
  alias: {
    '::sass-modules': path.resolve(__dirname, '../src/assets/styles/modules/'),
    '::types': path.resolve(__dirname, '../types/'),
    '::helpers': path.resolve(__dirname, '../src/helpers/'),
    '::graphql': path.resolve(__dirname, '../src/graphql/'),
    '::assets': path.resolve(__dirname, '../src/assets/'),
    '::shared-components': path.resolve(
      __dirname,
      '../src/components/app/shared-components/',
    ),
    '::hooks': path.resolve(__dirname, '../src/hooks/'),
    '::app': path.resolve(__dirname, '../src/components/app/'),
    '::auth': path.resolve(__dirname, '../src/components/auth/'),
    '::root': path.resolve(__dirname, '../src/components/'),
    '::store': path.resolve(__dirname, '../src/store/'),
    '::cypress': path.resolve(__dirname, '../cypress/'),
  },
  globalStyles: new RegExp(
    `(${[
      'node_modules/',
      'global.scss',
      'body.scss',
      'global-classes.scss',
      'material-ui.scss',
      'google-picker.scss',
      'css-variables.scss',
      'storybook.scss',
    ].join('|')})`,
  ),
  paths: {
    postCssConfig: path.resolve(__dirname, '../postcss.config.js'),
    dist: path.resolve(__dirname, '../dist'),
    iconsDist: path.resolve(__dirname, '../dist/icons/'),
    icons: path.resolve(__dirname, '../src/assets/icons'),
    env: undefined /*path.join(__dirname, '../.env')*/,
    src: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../cypress'),
      path.resolve(__dirname, '../types'),
    ],
  },
};
