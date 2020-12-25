import { config } from '../../rollup-configs/official-typescript-plugin/svg-sass/es';
import { input } from './rollup.config.input';
const args = Object.fromEntries(
  process.argv.filter(arg => arg.startsWith('--')).map(arg => [arg, true]),
);
export default {
  ...config,
  input: args['--single-input'] ? 'src/index.ts' : input,
};
