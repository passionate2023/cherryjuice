import typescript from '@rollup/plugin-typescript';
import { base } from './base';
const production = !process.env.ROLLUP_WATCH;

export const config = {
  ...base,
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      tsconfig: './tsconfig.cjs.json',
    }),
  ],
};
