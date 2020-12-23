import commonjs from '@rollup/plugin-commonjs';
import svg from '@cherryjuice/rollup-plugin-svg';

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
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-+([a-z])/g, g => g[g.length - 1].toUpperCase())}`,
      inject: {
        insertAt: 'top',
      },
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};
