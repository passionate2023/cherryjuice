/*
{
  type: 'png',
  '$': { justification: 'left', height: 267, width: 361 },
  other_attributes: { offset: 158 }
},
 {
        type: 'table',
        table: { td: [Array], th: [Array] },
        '$': { justification: 'left' },
        other_attributes: { offset: 160, col_min_width: 40, col_max_width: 600 }
      },
  {
        type: 'code',
        _: "console.log('hello');",
        '$': { justification: 'left', width: 900, height: 500 },
        other_attributes: {
          width_raw: 900,
          offset: 162,
          syntax: 'js',
          is_width_pix: 1,
          do_highl_bra: 1
        }
      }
 */
import { objToXml } from '../../helpers';

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
    if (node.type === 'png') {
      res = {
        ...common,
        anchor: undefined, // todo handle anchors
        png: node.src, // todo
      };
    } else if (node.type === 'code') {
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
    } else if (node.type === 'table') {
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
const extractOtherTables = nodes =>
  nodes.reduce(
    (acc, val) => {
      if (val.type) {
        if (!acc.otherTables[val.type]) acc.otherTables[val.type] = [];
        acc.otherTables[val.type].push(helpers.flattenNode({ node: val }));
        acc.nodes.push({ $: { justification: val.$.justification } });
      } else acc.nodes.push(val);
      return acc;
    },
    { nodes: [], otherTables: {} },
  );

export { extractOtherTables };
