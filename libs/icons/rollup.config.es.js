import { config } from '../../rollup-configs/official-typescript-plugin/svg-sass/es';
import { input } from './rollup.config.input';
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';
export default {
  ...config,
  plugins: [...config.plugins, dynamicImportVariables({})],
  input,
};
