import commonjs from '@rollup/plugin-commonjs';
import svg from '@cherryjuice/rollup-plugin-svg';
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';

import external from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export const shared = {
  input: 'src/index.ts',
  plugins: [
    svg(),
    external(),
    resolve(),
    dynamicImportVariables({
      // options
    }),
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-([a-z])/g, g => g[1].toUpperCase())}`,
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};
