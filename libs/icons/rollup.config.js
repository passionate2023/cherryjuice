import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import { shared } from './rollup.config.base';

const production = !process.env.ROLLUP_WATCH;

const es = {
  ...shared,
  output: [
    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
};
es.plugins.push(
  typescript({
    sourceMap: !production,
    inlineSources: !production,
    tsconfig: './tsconfig.es.json',
  }),
);
if (production) es.plugins.push(del({ targets: 'build/*' }));

export default [es];
