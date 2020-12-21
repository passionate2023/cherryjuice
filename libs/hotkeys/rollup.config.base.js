import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';

import external from 'rollup-plugin-node-externals';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export const shared = {
  input: 'src/index.ts',
  plugins: [
    external(),
    resolve(),
    dynamicImportVariables({
      // options
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};
