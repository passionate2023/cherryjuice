import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export const shared = {
  input: {
    index: 'src/index.ts',
    'on-paste': 'src/helpers/clipboard/on-paste.ts',
    execk: 'src/helpers/execK/index.ts',
    'execk-commands': 'src/helpers/execK/execk-commands.ts',
    'register-dev-hotkeys': 'src/helpers/hotkeys/register-dev-hotkeys.ts',
    'register-formatting-hot-keys':
      'src/helpers/hotkeys/register-formatting-hot-keys.ts',
    'toggle-bullet-point':
      'src/helpers/lists/bullet-points/toggle-bullet-point.ts',
    'insert-object': 'src/helpers/objects/insert-object.ts',
    'pages-manager': 'src/helpers/pages-manager/pages-manager.ts',
    rendering: 'src/helpers/rendering/html-to-ahtml/index.ts',
    snapback: 'src/helpers/snapback/snapback/snapback.ts',
    typing: 'src/helpers/typing/index.ts',
    'mutation-observer': 'src/hooks/mutation-observer.ts',
    'render-page': 'src/hooks/render-page.ts',
    'on-mouse-event': 'src/hooks/on-mouse-events/on-mouse-event.ts',
    bridge: 'src/bridge.ts',
    editor: 'src/editor.tsx',
  },

  plugins: [
    external(),
    resolve(),
    postcss({
      extensions: ['scss', 'css'],
      modules: true,
      namedExports: name =>
        `${name.replace(/-([a-z])/g, g => g[1].toUpperCase())}`,
      inject: {
        insertAt: 'top',
      },
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
    production && terser(),
  ].filter(Boolean),
};
