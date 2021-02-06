import { rollupConfig } from '../../rollup-config/index';

const input = {
  index: 'src/index.ts',
  'button-base': 'src/buttons/button-base/button-base.tsx',
  'button-circle': 'src/buttons/button-circle/button-circle.tsx',
  'button-square': 'src/buttons/button-square/button-square.tsx',
  'google-oauth-button':
    'src/buttons/google-oauth-button/google-oauth-button.tsx',
  'toolbar-button': 'src/buttons/toolbar-button/toolbar-button.tsx',
  'color-input': 'src/inputs/color-input/color-input.tsx',
  'validated-text-input':
    'src/inputs/validated-text-input/validated-text-input.tsx',
  'toolbar-color-input':
    'src/inputs/toolbar-color-input/toolbar-color-input.tsx',
  tooltip: 'src/unclassified/tooltip/tooltip.tsx',
};

export default {
  ...rollupConfig(),
  input: input,
};
