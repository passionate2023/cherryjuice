const Bundler = require('parcel-bundler');
const chalk = require('chalk');
let debug = require('debug');
const { exec } = require('child_process');
// Bundler options
const options = {
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  outFile: 'index.js', // The name of the outputFile
  publicUrl: '/', // The url to serve on, defaults to '/'
  watch: true, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: 'moduleName', // Expose modules as UMD under this name, disabled by default
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'node', // Browser/node/electron, defaults to browser
  bundleNodeModules: false, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  autoInstall: true // Enable or disable auto install of missing dependencies found during bundling
  /*hmr: true, // Enable or disable HMR while watching
      hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
      hmrHostname: '', // A hostname for hot module reload, default to ''
      detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
      */
};

const createDebug = name => (debug.enable(name), debug(name));

const run = () => {
  const debugParcel = createDebug('parcel');
  const entryFiles = './src/index.ts';
  const outFile = 'dist/index.js';
  const bundler = new Bundler(entryFiles, options);

  bundler
    .bundle()
    .then(() => {
      debugParcel(chalk.bgGreen.black('restarting the app'));
      const process = exec(`nodemon ${outFile}`);
      process.stdout.on('data', createDebug('nodemon'));
    })
    .catch(error => debugParcel(chalk.bgRed.black(error)));
};


run();
