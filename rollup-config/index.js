import { ts2 as ts2_es_cjs } from './typescript2/ts2';
import { es as ts_es } from './official-typescript-plugin/svg-sass/es';
import { cjs as ts_cjs } from './official-typescript-plugin/svg-sass/cjs';

const clean = process.env.clean !== 'false';
const mode = process.argv.includes('--ts2_cjs') ? 'ts2_cjs' : process.env.mode;

export const rollupConfig = () => {
  if (mode === 'ts2_es_cjs') return ts2_es_cjs({ clean, es: true, cjs: true });
  if (mode === 'ts2_es') return ts2_es_cjs({ clean, es: true });
  else if (mode === 'ts2_cjs') return ts2_es_cjs({ clean, cjs: true });
  else if (mode === 'ts_es') return ts_es({ clean });
  else if (mode === 'ts_cjs') return ts_cjs({ clean });
};
