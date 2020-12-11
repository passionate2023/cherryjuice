import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import path from 'path';
import alias from '@rollup/plugin-alias';

const production = process.env.NODE_ENV === 'production';
const useESBuild = process.env.mode === 'esbuild';
const projectRootDir = path.resolve(__dirname);
const aliasConfig = alias({
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
    replacement: path.resolve(projectRootDir, `${value[0].replace('/*', '')}`),
  })),
  customResolver: resolve({
    extensions: ['.tsx', '.ts'],
  }),
});
const esBuildConfig = esbuild({
  include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  exclude: /node_modules/, // default
  sourceMap: !production, // default
  minify: production,
  target: 'es2019',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
});

const mainConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: !production,
    },
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
    aliasConfig,
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-([a-z])/g, g => g[1].toUpperCase())}`,
    }),
    useESBuild
      ? esBuildConfig
      : typescript({
          check: false,
          clean: false,
          abortOnError: false,
          rollupCommonJSResolveHack: true,
          exclude: '**/__tests__/**',
          typescript: require('ttypescript'),
          tsconfigDefaults: {
            compilerOptions: {
              plugins: [
                { transform: 'typescript-transform-paths' },
                {
                  transform: 'typescript-transform-paths',
                  afterDeclarations: true,
                },
              ],
            },
          },
        }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
  ].filter(Boolean),
};
export default [mainConfig];
