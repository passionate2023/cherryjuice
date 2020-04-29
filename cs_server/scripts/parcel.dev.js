/* eslint-disable @typescript-eslint/no-var-requires */
const Bundler = require('parcel-bundler');
const chalk = require('chalk');
const childProcess = require('child_process');

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
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
  /*hmr: true, // Enable or disable HMR while watching
      hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
      hmrHostname: '', // A hostname for hot module reload, default to ''
      detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
      */
};
const entryFiles = './src/main.ts';
const console = {
  parcel: {
    log: data =>
      process.stdout.write(
        chalk.bgBlue.black('✨parcel ') + chalk.bgGreen.black(data) + '\n',
      ),
    error: data =>
      process.stdout.write(
        chalk.bgBlue.black('🚨parcel ') + chalk.bgRed.black(data) + '\n',
      ),
  },
  process: {
    log: data => process.stdout.write(chalk.black(data)),
    error: data => process.stdout.write(chalk.redBright(data)),
  },
};
const helpers = {
  killPreviousProcess: child => {
    child.stdout.removeAllListeners('data');
    child.stderr.removeAllListeners('data');
    child.removeAllListeners('exit');
    child.kill();
  },

  startNewProcess: (state, bundle) => {
    state.child = childProcess.spawn(
      'node',
      [process.argv[2], bundle.name].filter(Boolean),
    );
    state.child.stdout.on('data', console.process.log);
    state.child.stderr.on('data', console.process.error);

    state.child.on('exit', code => {
      console.parcel.error(`Child process exited with code ${code}`);
      console.parcel.error(`waiting for changes to restart\n`);
      state.child = null;
    });
  },
};
const run = ({ entryFiles, options }) => {
  const bundler = new Bundler(entryFiles, options);

  const state = {
    bundle: null,
    child: null,
  };

  bundler.on('bundled', compiledBundle => {
    console.parcel.log(chalk.bgGreen.black('bundling'));
    state.bundle = compiledBundle;
  });
  bundler.on('buildError', error => {
    console.parcel.error(
      typeof error === 'string' ? error : JSON.stringify(error),
    );
    console.parcel.error(`waiting for changes to restart\n`);
  });
  bundler.on('buildEnd', () => {
    if (state.bundle !== null) {
      if (state.child) helpers.killPreviousProcess(state.child);
      console.parcel.log(chalk.bgGreen.black('starting the app'));
      helpers.startNewProcess(state, state.bundle);
    }
    state.bundle = null;
  });

  bundler.bundle();
};
run({ entryFiles, options });
