import svg from '@cherryjuice/rollup-plugin-svg';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;
export const shared = {
  plugins: [
    svg(),
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-+([a-z])/g, g => g[g.length - 1].toUpperCase())}`,
      inject: {
        insertAt: 'top',
      },
    }),
    production && terser(),
  ],
};
