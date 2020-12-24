import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

const es = {
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
      dir: 'build',
    },
  ],
};

if (production) es.plugins.push(del({ targets: 'build/*' }));

export default [es];
