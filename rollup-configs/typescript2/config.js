import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import { shared as _ } from '../shared';

export const shared = {
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    ..._.plugins,
    external(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: '**/__tests__/**',
      clean: true,
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    external(),
    resolve(),
  ].filter(Boolean),
};
