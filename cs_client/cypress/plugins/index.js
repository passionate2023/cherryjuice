/* eslint-disable @typescript-eslint/no-var-requires */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const common = require('../../.webpack/webpack.common');
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = on => {
  const config = common;
  const options = {
    webpackOptions: {
      mode: 'development',
      resolve: config.resolve,
      module: config.module,
    },
    watchOptions: {},
  };

  on('file:preprocessor', webpackPreprocessor(options));
};
