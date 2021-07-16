import { rollupConfig } from 'rollup-config';

const input = {
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
  'sort-formatting-buttons': 'src/hooks/sort-formatting-buttons.ts',
  'on-mouse-event': 'src/hooks/on-mouse-events/on-mouse-event.ts',
  bridge: 'src/bridge.ts',
  editor: 'src/editor.tsx',
};

export default {
  ...rollupConfig(),
  input: input,
};
