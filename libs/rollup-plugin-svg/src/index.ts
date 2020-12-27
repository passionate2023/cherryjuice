// copied from https://github.com/antony/rollup-plugin-svg/blob/master/src/index.js
import { extname } from 'path';
import { createFilter } from 'rollup-pluginutils';
import { toDataUrl } from '::helpers/to-data-url';

type Props = {
  include?: Array<string | RegExp> | string | RegExp | null;
  exclude?: Array<string | RegExp> | string | RegExp | null;
};

export default (options: Props = {}) => {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'svg',

    transform(code, id) {
      if (!filter(id) || extname(id) !== '.svg') {
        return null;
      }

      const trimmed = code.trim();
      const encoded = JSON.stringify(trimmed);

      return {
        code: `export const svg = ${encoded}; export const base64 = "${toDataUrl(
          trimmed,
        )}";`,
        map: { mappings: '' },
      };
    },
  };
};
