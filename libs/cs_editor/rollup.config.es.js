import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
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
  plugins: [
    ...shared.plugins,
    production && del({ targets: 'build/*' }),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      tsconfig: './tsconfig.es.json',
    }),
    production && terser(),
  ].filter(Boolean),
};

export default es;
