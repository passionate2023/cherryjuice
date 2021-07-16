import { rollupConfig } from 'rollup-config';

export const input = {
  index: 'src/index.ts',
  'flatten-hot-key': 'src/helpers/flatten-hot-key.ts',
  'hotkeys-to-dict': 'src/helpers/hotkeys-to-dict.ts',
  'hotkeys-manager': 'src/hotkeys-manager.ts',
};
export default {
  ...rollupConfig(),
  input: input,
};
