import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { shared } from '../../shared';

export const base = {
  plugins: [
    ...shared.plugins,
    external(),
    resolve(),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
  ].filter(Boolean),
};
