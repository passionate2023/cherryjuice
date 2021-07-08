import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { zero } from '../../zero';

export const one = ({ clean }) => ({
  plugins: [
    ...zero({ clean }).plugins,
    external(),
    resolve(),
    commonjs({
      include: ['node_modules/**'],
    }),
  ].filter(Boolean),
});
