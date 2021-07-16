import { rollupConfig } from 'rollup-config';

const input = {
  index: 'src/index.ts',
  'button-base': 'src/buttons/button-base/button-base.tsx',
  'button-circle': 'src/buttons/button-circle/button-circle.tsx',
  'button-square': 'src/buttons/button-square/button-square.tsx',
  'drop-down-button': 'src/buttons/drop-down-button/drop-down-button.tsx',
  'google-oauth-button':
    'src/buttons/google-oauth-button/google-oauth-button.tsx',
  'toolbar-button': 'src/buttons/toolbar-button/toolbar-button.tsx',
  'color-input': 'src/inputs/color-input/color-input.tsx',
  'toolbar-color-input':
    'src/inputs/toolbar-color-input/toolbar-color-input.tsx',
  'validated-text-input':
    'src/inputs/validated-text-input/validated-text-input.tsx',
  'context-menu': 'src/popups/context-menu/context-menu.tsx',
  popper: 'src/popups/popper/popper.tsx',
  scrim: 'src/popups/scrim/scrim.tsx',
  tooltip: 'src/popups/tooltip/tooltip.tsx',
  board: 'src/storybook/board.tsx',
  portal: 'src/unclassified/portal/portal.tsx',
};

export default {
  ...rollupConfig(),
  input: input,
};
