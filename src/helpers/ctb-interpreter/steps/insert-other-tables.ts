import { parseTable } from './parse-table';
import { parseXml } from '../../helpers';
import { curry } from 'ramda';

const adjustNode = ({ node, type }) => {
  // console.log('inside adjust-node', { node, type });
  switch (type) {
    case 'codebox':
      return {
        type: 'code',
        _: node.txt,
        $: {
          justification: node.justification,
          width: node.width,
          height: node.height
        },
        other_attributes: {
          width_raw: node.width,
          offset: node.offset,
          syntax: node.syntax,
          is_width_pix: node.is_width_pix,
          do_highl_bra: node.do_highl_bra,
          o_show_linenum: node.o_show_linenum
        }
      };
    case 'image':
      // if (node.anchor) console.log('anchor!', node);
      return node.anchor
        ? {
            type: 'anchor',
            $: {
              justification: node.justification
            },
            other_attributes: {
              id: `#${node.anchor}`,
              offset: node.offset
            }
          }
        : {
            type: 'png',
            $: {
              justification: node.justification,
              height: node.height,
              width: node.width
            },
            other_attributes: {
              offset: node.offset
            }
          };
    case 'table':
      return {
        type: 'table',
        table: parseTable({ xmlTable: node.txt }),
        $: {
          justification: node.justification
        },

        other_attributes: {
          offset: node.offset,
          col_min_width: node.col_min,
          col_max_width: node.col_max
        }
      };
  }
};

const insertOtherTables = curry((otherTables, oldXml) => {
  // remove any empty nodes that ct uses for images/anchors/code...
  const xml = oldXml.filter(
    node => node && (typeof node === 'string' || node._)
  );
  let log = [];
  let numberOfInsertedElements = 0;
  const xmlLength = xml.length;
  Object.entries(otherTables).forEach(([tableType, tables]) => {
    (tables as Array<any>).forEach(miscNode => {
      const offset = miscNode.offset;
      let totalLength = 0;
      if (!xmlLength) {
        xml.push(adjustNode({ node: miscNode, type: tableType }));
      } else {
        for (const node of xml) {
          const nodeString = typeof node === 'string' ? node : node._;
          if (nodeString && !node.type) {
            const nodeLength = nodeString.length;
            const localOffset = offset - totalLength;
            // log.push([
            //   nodeString,
            //   totalLength,
            //   localOffset,
            //   node.$ && node.$.containsNewLine
            // ]);
            if (localOffset - numberOfInsertedElements <= nodeLength) {
              const [firstHalf, secondHalf] = [
                nodeString.substring(0, localOffset - numberOfInsertedElements),
                nodeString.substring(localOffset - numberOfInsertedElements)
              ];

              const i = xml.indexOf(node);
              const toBeInserted = [];
              if (firstHalf) toBeInserted.push(firstHalf);
              toBeInserted.push(
                adjustNode({ node: miscNode, type: tableType })
              );
              if (secondHalf) toBeInserted.push(secondHalf);
              xml.splice(i, 1, ...toBeInserted);
              // log.push([
              //   'inserting',
              //   JSON.stringify({ firstHalf, secondHalf, offset })
              // ]);
              numberOfInsertedElements++;
              break;
            } else {
              totalLength += nodeLength;
            }
          }
        }
      }
    });
  });
  // console.log({ str: log });
  return xml;
});
// things to consider
// a node adds 3 units to the total length

export { insertOtherTables };
