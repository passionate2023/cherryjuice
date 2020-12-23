import typescript from '@rollup/plugin-typescript';
import { shared } from './rollup.config.base';
import del from 'rollup-plugin-delete';
const production = !process.env.ROLLUP_WATCH;

const es = {
  ...shared,
  input: {
    index: 'src/index.ts',
    ...Object.fromEntries(
      [
        'button-base',
        'button-circle',
        'button-square',
        'drop-down-button',
        'google-oauth-button',
      ].map(f => [f, `src/buttons/${f}/${f}.tsx`]),
    ),
  },
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
  ...[
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      tsconfig: './tsconfig.es.json',
    }),
    production && del({ targets: 'build' }),
  ].filter(Boolean),
);

export default es;
