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
const { copyDownloadedFile } = require('./downloaded-file-meta');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const common = require('../../../../apps/client/.webpack/webpack.common.js');
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  const existingWebpackConfig = common;
  const webpackConfig = {
    webpackOptions: {
      mode: 'development',
      resolve: existingWebpackConfig.resolve,
      module: existingWebpackConfig.module,
    },
    watchOptions: {},
  };

  on('file:preprocessor', webpackPreprocessor(webpackConfig));
  on('task', {
    // deconstruct the individual properties
    copyDownloadedFile({ name, tempSubFolder, extension, suffix }) {
      return copyDownloadedFile({ name, tempSubFolder, extension, suffix });
    },
  });
  const chromium = {
    name: 'chromium',
    channel: 'stable',
    family: 'chromium',
    displayName: 'Chromium',
    version: '87.0.4',
    path: 'C:\\Users\\lpflo\\AppData\\Local\\Chromium\\Application\\chrome.exe',
    majorVersion: 87,
  };
  return {
    browsers: [...config.browsers, chromium],
  };
};
