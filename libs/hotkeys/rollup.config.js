import commonjs from '@rollup/plugin-commonjs';
import svg from '@cherryjuice/rollup-plugin-svg';
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';

import external from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

const production = !process.env.ROLLUP_WATCH;

const mainConfig = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    svg(),
    production && del({ targets: 'build/*' }),
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
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};
export default [mainConfig];
