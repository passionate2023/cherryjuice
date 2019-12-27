import { interpreter } from './interpreter';
import { parseString } from 'xml2js';
import { separator } from './separator';
import { splitter } from './splitter';
const parseRichText = ({ xml, stringify,node_name: node_info }) =>
  new Promise((resolve, reject) => {

    parseString(xml, async function(err, result) {
      console.log('xml',xml)
      if(err) console.log(`Error 😱😱😱 node_name: ${node_info} error:${err}`);
      if (err) reject(err);
      else {
        const interpreted = result.node.rich_text.map(node => {
          if (typeof node === 'object') {
            node.$$ = interpreter(node.$);
          }
          return node;
        });
        console.log('pre separation');
        const separated = separator(interpreted);
        console.log('pre splitting');
        const split = splitter(separated);
        console.log('pre resolving');
        resolve(stringify ? JSON.stringify(split) : split);
      }
    });
  });
export { parseRichText };
