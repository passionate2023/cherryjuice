import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';
import alias from '@rollup/plugin-alias';
const customResolver = resolve({
  extensions: ['.tsx', '.ts'],
});
const productionMode = process.env.NODE_ENV === 'production';
import path from 'path';
const projectRootDir = path.resolve(__dirname);
const entries = Object.entries({
  '::sass-modules/*': ['./src/assets/styles/modules/*'],
  '::types/*': ['./types/*'],
  '::helpers/*': ['./src/helpers/*'],
  '::assets/*': ['./src/assets/*'],
  '::hooks/*': ['./src/hooks/*'],
  '::root/*': ['./src/*'],
  '::cypress/*': ['./cypress/*'],
}).map(([alias, value]) => ({
  find: new RegExp(`${alias.replace('/*', '')}`),
  replacement: path.resolve(projectRootDir, `${value[0].replace('/*', '')}`),
}));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    alias({
      entries,
      customResolver,
    }),
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: !productionMode, // default
      minify: productionMode,
      target: 'es2019',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    postcss({ extensions: ['scss', 'css'] }),
  ],
};
