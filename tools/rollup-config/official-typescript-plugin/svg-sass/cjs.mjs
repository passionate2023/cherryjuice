import typescript from '@rollup/plugin-typescript';
import { one } from './one.mjs';
const production = !process.env.ROLLUP_WATCH;

export const cjs = ({ clean }) => {
  const shared = one({ clean });
  return {
    ...shared,
    output: [
      {
        dir: 'build/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: !production,
      },
    ],
    plugins: [
      ...shared.plugins,
      typescript({
        sourceMap: !production,
        inlineSources: !production,
        tsconfig: './tsconfig.cjs.json',
      }),
    ],
  };
};
