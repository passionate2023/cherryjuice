const paths = require('./paths');
const production = process.env.NODE_ENV === 'production';
const storybook = process.env.STORYBOOK === 'true';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const styleLoader = production ? MiniCssExtractPlugin.loader : 'style-loader';

const globalStyles = new RegExp(
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
);

module.exports = {
  workerLoader: {
    test: /\.worker\.ts$/,
    use: {
      loader: 'worker-loader',
      options: {
        name: 'WorkerName.[hash].js',
        inline: true,
        publicPath: '/workers/',
      },
    },
  },

  javascriptAndTypescript: {
    test: /\.(mjs|js|ts|tsx)$/,
    use: {
      loader: "swc-loader",
      options: {
        // sync: true makes swc-loader invoke swc synchronously. useful to see errors
        sync: false,
        "jsc": {
          "target": "es2018",
          "parser": {
            "syntax": "typescript",
            "tsx": true, "dynamicImport": true,
            "decorators": true
          }, "loose": true
        }
      }
    },
    include: [
      paths.src,
      paths.cypress,
      paths.types,
      storybook && paths.components,
    ].filter(Boolean),
  },
  graphql: {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    use: {
      loader: 'raw-loader',
    },
  },
  svg: { test: /\.svg$/, loader: 'svg-inline-loader' },
  sassModules: {
    test: /\.(s[ac]|c)ss$/i,
    use: [
      styleLoader,
      {
        loader: 'css-loader',
        options: {
          localsConvention: 'dashes',
          importLoaders: 2,
          modules: {
            localIdentName: production ? '[hash:base64]' : '[local]',
          },
          esModule: true,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
        },
      },
    ],
    exclude: globalStyles,
  },
  sassGlobal: {
    test: /\.(s[ac]|c)ss$/i,
    use: [
      styleLoader,
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            includePaths: ['node_modules',]
          },
          implementation: require('sass'),
        },
      },
    ],
    include: globalStyles,
  },
};
