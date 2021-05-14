/* eslint-disable @typescript-eslint/no-var-requires */
/*
    "build:libs:cjs": "run-p \"build:lib0:* --ts2_cjs\" && run-p \"build:lib:* --ts2_cjs\" && run-p \"build:lib2:* --ts2_cjs\" && run-p \"build:lib3:* --ts2_cjs\"",
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = prefix => message =>
  // eslint-disable-next-line no-console
  console.log(prefix ? `${prefix}: ${message}` : message);

const libs = {
  0: { 1: 'rollup-plugin-svg' },
  1: {
    1: 'graphql-types',
    2: 'ahtml-to-html',
    3: 'shared-helpers',
    4: 'shared-styles',
  },
  2: {
    1: 'ctb-to-ahtml',
    2: 'default-settings',
    3: 'icons',
    4: 'hotkeys',
  },
  3: {
    1: 'editor',
    2: 'components',
  },
};

const apps = { 0: { 1: 'react-client', 2: 'nest-server' } };

const runScriptAtLevel = script => level => {
  return Promise.allSettled(
    Array.from(level).map(packageName => {
      const command = `yarn workspace @cherryjuice/${packageName} run ${script}`;
      log(packageName)(command);
      const promise = exec(command);
      const child = promise.child;
      child.stdout.on('data', log(packageName));
      child.stderr.on('data', log(packageName));
      child.on('exit', code => {
        if (code) process.exit(code);
      });
      return promise;
    }),
  );
};

const flags = {
  parallel: false,
  apps: false,
};
const args = Array.from(process.argv)
  .slice(2)
  .reduce((acc, val) => {
    if (val === '-p') {
      flags.parallel = true;
    } else if (val === '-a') {
      flags.apps = true;
    } else acc.push(val);
    return acc;
  }, []);
const script = args.join(' ');
const levels = flags.apps ? Object.values(apps) : Object.values(libs);
if (script)
  if (flags.parallel)
    for (const level of levels) runScriptAtLevel(script)(Object.values(level));
  else
    (async () => {
      for await (const level of levels)
        await runScriptAtLevel(script)(Object.values(level));
    })();
