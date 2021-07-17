import { rollupConfig } from 'rollup-config';

export default {
  ...rollupConfig(),
  input: {
    index: 'src/index.ts',
  },
};
