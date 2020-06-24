import { objToXml } from '../../../../../../../node/helpers/xml';
import { AHtmlNode } from '../../../../../../../node/helpers/rendering/ahtml-to-html';
import { CTBObject } from '../../translate-ahtml/helpers/translate-object/translate-object';

const helpers = {
  table: ({ th, td }) => ({
    table: {
      row: [...td, th].map(row => row.map(cell => ({ cell }))),
    },
  }),
  flattenNode: ({ node }) => {
    let res = {};
    const common = {
      offset: node.other_attributes.offset,
      justification: node.$.justification,
    };
    if (node.type === 'image') {
      res = {
        ...common,
        anchor: undefined, // todo handle anchors
        png: node.src, // todo
      };
    } else if (node.type === 'codebox') {
      res = {
        ...common,
        txt: node._,
        syntax: node.other_attributes.syntax,
        width: node.other_attributes.width_raw,
        height: node.$.height,
        is_width_pix: node.other_attributes.is_width_pix,
        do_highl_bra: node.other_attributes.do_highl_bra,
        do_show_linenum: node.other_attributes.do_show_linenum,
      };
    } else if (node.type === 'grid') {
      res = {
        ...common,
        txt: objToXml({ xmlObject: helpers.table(node.table) }),
        col_min: node.other_attributes.col_min_width,
        col_max: node.other_attributes.col_max_width,
      };
    }
    return res;
  },
};
// const nodeType_nodeTableName = {
//   code: 'codebox',
//   table: 'grid',
//   png: 'image',
// };

const extractObjects = (nodes: (AHtmlNode | CTBObject)[]) => {
  const state = {
    offset: 0,
  };
  return nodes.reduce(
    (acc, val) => {
      if (val['row']) {
        acc.otherTables[val.type].push({
          ...val['row'],
          offset: state.offset,
        });
        acc.nodes.push({ $: { justification: val['row'].justification } });
        state.offset += 1;
      } else {
        acc.nodes.push(val);
        state.offset +=
          typeof val === 'string'
            ? (val as string).length
            : val._
            ? val._.length
            : 0;
      }
      return acc;
    },
    { nodes: [], otherTables: { codebox: [], grid: [] } },
  );
};

export { extractObjects };
