import { interpreter } from './interpreter';
import { parseString } from 'xml2js';
import { separator } from './separator';
import { splitter } from './splitter';
const parseRichText = ({ xml, stringify }) =>
  new Promise((resolve, reject) => {
    parseString(xml, async function(err, result) {
      if (err) reject(err);
      else {
        const interpreted = result.node.rich_text.map(node => {
          if (typeof node === 'object') {
            node.$$ = interpreter(node.$);
          }
          return node;
        });

        const separated = separator(interpreted);
        const split = splitter(separated);
        resolve(stringify ? JSON.stringify(split) : split);
      }
    });
  });
export { parseRichText };
