import { parseTable } from './parse-table';
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

const getInsertionPosition = ({ xml, miscNodeOffset }) => {
  let accumulatedLength = 0;
  let nodeIndex = 0;
  let nodeString = undefined;

  for (const node of xml) {
    let _nodeString, nodeLength;
    if (node.type) {
      nodeLength = 1;
    } else {
      _nodeString = typeof node === 'string' ? node : node._ ? node._ : '';
      nodeLength = _nodeString.length;
    }
    if (miscNodeOffset < nodeLength + accumulatedLength) {
      nodeString = _nodeString;
      break;
    } else {
      nodeIndex++;
      accumulatedLength += nodeLength;
    }
  }
  return { nodeString, nodeIndex, accumulatedLength };
};

const insertNode = ({
  nodeString,
  nodeIndex,
  accumulatedLength,
  xml,
  miscNode
}) => {
  if (!nodeString) {
    xml.push(
      adjustNode({
        node: miscNode,
        type: miscNode.tableName
      })
    );
  } else {
    const localOffset = miscNode.offset - accumulatedLength;
    const [firstHalf, secondHalf] = [
      nodeString.substring(0, localOffset),
      nodeString.substring(localOffset)
    ];

    const toBeInserted = [];
    if (firstHalf) toBeInserted.push(firstHalf);
    toBeInserted.push(
      adjustNode({
        node: miscNode,
        type: miscNode.tableName
      })
    );
    if (secondHalf) toBeInserted.push(secondHalf);
    xml.splice(nodeIndex, 1, ...toBeInserted);
  }
};

const insertOtherTables = curry((otherTables, oldXml) => {
  // remove any empty nodes that ct uses for images/anchors/code...
  const xml = oldXml.filter(
    node => node && (typeof node === 'string' || node._)
  );
  let log = [];
  console.log({ xml });
  Object.entries(otherTables)
    // @ts-ignore
    .flatMap(([tableName, elements]) =>
      elements.map(element => ({ ...element, tableName }))
    )
    .sort((a, b) => a.offset - b.offset)
    .forEach(miscNode => {
      const {
        nodeString,
        nodeIndex,
        accumulatedLength
      } = getInsertionPosition({ xml, miscNodeOffset: miscNode.offset });
      insertNode({ miscNode, xml, nodeIndex, nodeString, accumulatedLength });
      // log.push([
      //   'inserting',
      //   JSON.stringify({
      //     accumulatedLength,
      //     nodeIndex,
      //     nodeString,
      //     offset: miscNode.offset,
      //     xml
      //   })
      // ]);
    });
  // console.log({ str: log });
  return xml;
});
// things to consider
// a node adds 3 units to the total length

export { insertOtherTables };
