import { shared } from '../../rollup-configs/typescript2/config.js';
export default {
  ...shared,
  input: {
    index: 'src/index.ts',
    'ahtml-to-html': 'src/ahtml-to-html.tsx',
    objects: 'src/objects/index.ts',
    helpers: 'src/helpers/index.ts',
    element: 'src/element/index.ts',
  },
};
