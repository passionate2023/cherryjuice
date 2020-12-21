import typescript from '@rollup/plugin-typescript';
import { shared } from './rollup.config.base';
const production = !process.env.ROLLUP_WATCH;

const cjs = {
  ...shared,
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: !production,
    },
  ],
};
cjs.plugins.push(
  typescript({
    sourceMap: !production,
    inlineSources: !production,
    tsconfig: './tsconfig.cjs.json',
  }),
);

export default [cjs];
