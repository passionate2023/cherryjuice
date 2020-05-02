module.exports = {
  plugins: {
    'postcss-camel-case': {
      skipUnderscore: true,
      globalModulePaths: [
        'global-classes.scss',
        'material-ui.scss',
        'google-picker.scss',
      ],
    },
  },
};
