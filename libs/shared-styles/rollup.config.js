import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

const cjs = {
  input: 'src/index.js',
  plugins: [
    copy({
      targets: [
        { src: 'src/themes/**/*', dest: 'build/themes' },
        { src: 'src/mixins/**/*', dest: 'build/mixins' },
        { src: 'src/vars/**/*', dest: 'build/vars' },
        { src: 'src/global/**/*', dest: 'build/global' },
      ],
    }),
  ],
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: !production,
    },
  ],
};

if (!production)
  cjs.plugins.push({
    name: 'watch-external',
    async buildStart() {
      this.addWatchFile('./src');
    },
  });
if (production) cjs.plugins.push(del({ targets: 'build/*' }));

export default [cjs];
