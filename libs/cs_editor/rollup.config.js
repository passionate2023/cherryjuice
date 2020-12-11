import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';
import alias from '@rollup/plugin-alias';
import path from 'path';

const production = process.env.NODE_ENV === 'production';
const projectRootDir = path.resolve(__dirname);
const mainConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    external(),
    resolve(),
    alias({
      entries: Object.entries({
        '::sass-modules/*': ['./src/assets/styles/modules/*'],
        '::types/*': ['./types/*'],
        '::helpers/*': ['./src/helpers/*'],
        '::assets/*': ['./src/assets/*'],
        '::hooks/*': ['./src/hooks/*'],
        '::root/*': ['./src/*'],
        '::cypress/*': ['./cypress/*'],
      }).map(([alias, value]) => ({
        find: new RegExp(`${alias.replace('/*', '')}`),
        replacement: path.resolve(
          projectRootDir,
          `${value[0].replace('/*', '')}`,
        ),
      })),
      customResolver: resolve({
        extensions: ['.tsx', '.ts'],
      }),
    }),
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-([a-z])/g, g => g[1].toUpperCase())}`,
    }),
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: !production, // default
      minify: production,
      target: 'es2019',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
  ],
};
export default [mainConfig];
