import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { zero } from '../../zero.mjs';

export const one = ({ clean }) => {
  const z = zero({ clean });
  return ({
    ...z,
    plugins: [
      ...z.plugins,
      external(),
      resolve(),
      commonjs({
        include: ['node_modules/**'],
      }),
    ].filter(Boolean),
  });
};
