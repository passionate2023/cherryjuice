import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

const production = !process.env.ROLLUP_WATCH;

const mainConfig = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: !production,
    },

    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    production && del({ targets: 'build/*' }),
    external(),
    resolve(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};

export default mainConfig;
