import svg from 'rollup-plugin-svg';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

const production = !process.env.ROLLUP_WATCH;
export const zero = ({ clean }) => ({
  plugins: [
    svg.default(),
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
    clean && del({ targets: 'build' }),
  ].filter(Boolean),
  onwarn() {
    return
  }
});
