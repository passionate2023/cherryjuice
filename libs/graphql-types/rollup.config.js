import { rollupConfig } from '../../rollup-config/index';

export default {
  ...rollupConfig(),
  input: {
    index: 'src/index.ts',
  },
};
