import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: {
    index: 'src/index.ts',
    'ahtml-to-html': 'src/ahtml-to-html.tsx',
    objects: 'src/objects/index.ts',
    helpers: 'src/helpers/index.ts',
    element: 'src/element/index.ts',
  },
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
  ],
};
