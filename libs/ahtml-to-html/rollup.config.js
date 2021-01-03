import { rollupConfig } from '../../rollup-config/index';

export default {
  ...rollupConfig(),
  input: {
    index: 'src/index.ts',
    'ahtml-to-html': 'src/ahtml-to-html.tsx',
    objects: 'src/objects/index.ts',
    helpers: 'src/helpers/index.ts',
    element: 'src/element/index.ts',
  },
};
