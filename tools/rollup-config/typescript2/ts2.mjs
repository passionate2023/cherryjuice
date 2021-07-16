import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import { zero } from '../zero.mjs';
const production = !process.env.ROLLUP_WATCH;

export const ts2 = ({ cjs, es, clean }) => {
  const shared = zero({ clean });
  return {
    output: [
      cjs && {
        dir: 'build/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: !production,
      },
      es && {
        dir: 'build',
        format: 'es',
        exports: 'named',
        sourcemap: !production,
      },
    ].filter(Boolean),
    ...shared,
    plugins: [
      ...shared.plugins,
      external(),
      resolve(),
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: '**/__tests__/**',
        clean,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: { declaration: true, declarationDir: 'build/types' },
        },
      }),
      commonjs({
        include: ['../../node_modules/**', 'node_modules/**'],
      }),
      external(),
      resolve(),
    ].filter(Boolean),
  };
};
