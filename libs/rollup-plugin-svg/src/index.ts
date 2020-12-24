// copied from https://github.com/antony/rollup-plugin-svg/blob/master/src/index.js
import { extname } from 'path';
import { createFilter } from 'rollup-pluginutils';

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

      const encoded = JSON.stringify(code.trim());

      return { code: `export default ${encoded}`, map: { mappings: '' } };
    },
  };
};
