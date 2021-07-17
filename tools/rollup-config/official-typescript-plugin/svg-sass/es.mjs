import typescript from '@rollup/plugin-typescript';

import { one } from './one.mjs';
const production = !process.env.ROLLUP_WATCH;

export const es = ({ clean }) => {
  const shared = one({ clean });
  return {
    ...shared,
    output: [
      {
        dir: 'build',
        format: 'es',
        exports: 'named',
        sourcemap: !production,
      },
    ],
    plugins: [
      ...shared.plugins,
      typescript({
        sourceMap: !production,
        inlineSources: !production,
        tsconfig: './tsconfig.es.json',
      }),
    ].filter(Boolean),
  };
};
