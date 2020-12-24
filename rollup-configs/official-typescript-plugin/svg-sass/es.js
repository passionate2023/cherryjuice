import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';

import { base } from './base';
const production = !process.env.ROLLUP_WATCH;

export const config = {
  ...base,
  output: [
    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      tsconfig: './tsconfig.es.json',
    }),
    production && del({ targets: 'build' }),
  ].filter(Boolean),
};
