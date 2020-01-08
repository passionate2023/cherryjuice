import { TCt_node } from '../types/types';

const rootNode = {
  node_id: 0,
  father_id: -1,
  name: 'root',
  txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
  is_richtxt: 0,
  has_image: 0,
  has_codebox: 0,
  has_table: 0,
  ts_creation: 0,
  ts_lastsave: 0,
  child_nodes: [],
  has_txt: false,
};

const ctbQuery = {
  node_meta: ({ node_id }) => `
  SELECT 
    n.node_id, n.name, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation,n.ts_lastsave, c.father_id 
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id ${node_id ? `AND n.node_id = ${node_id}` : ''}
   `,
  node_text: ({ node_id }) => `
  SELECT 
    n.node_id, n.name, n.txt 
   FROM node as n
   where n.node_id = ${node_id}
   `,
  images: ({ node_id, offset }) => `
    SELECT 
    i.node_id,  i.offset, i.justification, 
    i.anchor, i.png
   FROM  image as i
   where i.node_id = ${node_id} ${offset ? `AND i.offset = ${offset}` : ''}
  `,
  codebox: ({ node_id }) => `
  SELECT
  node_id, offset, justification, txt, syntax, width, height, is_width_pix, do_highl_bra, do_show_linenum
  from codebox where node_id = ${node_id} 
  `,
  table: ({ node_id }) => `
  SELECT node_id, offset, justification, txt, col_min, col_max
  FROM grid
  WHERE node_id = ${node_id};
  `,
};

const organizeData = async data => {
  const nodes: Map<number, TCt_node> = new Map(
    data.map(node => [node.node_id, node]),
  );

  data.forEach(node => {
    let parentNode = nodes.get(node.father_id);
    if (parentNode) parentNode.child_nodes.push(node.node_id);
  });

  return { nodes };
};

const getPngDimensions = base64 => {
  if (!base64) return undefined;
  const header = atob(base64.slice(0, 50)).slice(16, 24);
  const uint8 = Uint8Array.from(header, c => c.charCodeAt(0));
  const dataView = new DataView(uint8.buffer);

  return {
    width: dataView.getInt32(0),
    height: dataView.getInt32(4),
  };
};
const getPNGSize = buffer => {
  if (!buffer) return undefined;
  if (buffer.toString('ascii', 12, 16) === 'CgBI') {
    return {
      width: buffer.readUInt32BE(32),
      height: buffer.readUInt32BE(36),
    };
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
};
const bufferToPng = buffer =>
  buffer ? new Buffer(buffer, 'binary').toString('base64') : undefined;

export { ctbQuery, rootNode, bufferToPng, organizeData, getPNGSize };
