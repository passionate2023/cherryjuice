import typescript from '@rollup/plugin-typescript';
import { shared } from './rollup.config.base';
import del from 'rollup-plugin-delete';
const production = !process.env.ROLLUP_WATCH;

const es = {
  ...shared,
  input: {
    index: 'src/index.ts',
    'button-base': 'src/buttons/button-base/button-base.tsx',
    'button-circle': 'src/buttons/button-circle/button-circle.tsx',
    'button-square': 'src/buttons/button-square/button-square.tsx',
    'drop-down-button': 'src/buttons/drop-down-button/drop-down-button.tsx',
    'google-oauth-button':
      'src/buttons/google-oauth-button/google-oauth-button.tsx',
    'toolbar-button': 'src/buttons/toolbar-button/toolbar-button.tsx',
    'color-input': 'src/inputs/color-input/color-input.tsx',
    'toolbar-color-input':
      'src/inputs/toolbar-color-input/toolbar-color-input.tsx',
    tooltip: 'src/unclassified/tooltip/tooltip.tsx',
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
