import { extractOtherTables } from './tables';
import { objToXml } from '../../../../../helpers/xml';

// const adjustNewLine = nodes =>
//   nodes.reduce((acc, val, i) => {
//     if (val === newLineCharacter || val._ === newLineCharacter) {
//       if (acc[acc.length - 1])
//         acc[acc.length - 1]._
//           ? (acc[acc.length - 1]._ += val)
//           : (acc[acc.length - 1] += val);
//     } else acc.push(val);
//     return acc;
//   }, []);

const midPipeToCtb = nodes => {
  const { nodes: rich_text, otherTables } = extractOtherTables(nodes);
  return {
    xmlString: objToXml({
      xmlObject: {
        node: {
          rich_text,
        },
      },
    }),
    otherTables,
  };
};
export { midPipeToCtb };
