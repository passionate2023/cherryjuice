const rootNode = {
  node_id: 0,
  father_id: -1,
  name: 'root',
  txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
  is_richtxt: 0,
  has_image: 0,
  has_codebox: 0,
  has_table: 0,
  sequence: 0,
  ts_creation: 0,
  ts_lastsave: 0,
  child_nodes: [],
  has_txt: false,
};
type TCt_node = typeof rootNode;
const nodeTitleHelpers = {
  hasForground: is_richtxt => (is_richtxt >> 2) & 0x01,

  isBold: is_richtxt => (is_richtxt >> 1) & 0x01,
  customIconId: is_ro => is_ro >> 1,
  rgb_str_from_int24bit: int24bit => {
    const r = (int24bit >> 16) & 0xff;
    const g = (int24bit >> 8) & 0xff;
    const b = int24bit & 0xff;
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

const nodeTitleStyle = ({ is_richtxt }) => {
  return JSON.stringify({
    color: nodeTitleHelpers.hasForground(is_richtxt)
      ? nodeTitleHelpers.rgb_str_from_int24bit((is_richtxt >> 3) & 0xffffff)
      : '#ffffff',
    fontWeight: nodeTitleHelpers.isBold(is_richtxt) ? 'bold' : 'normal',
  });
};
const organizeData = async data => {
  const nodes: Map<number, TCt_node> = new Map(
    data.map(node => [node.node_id, node]),
  );

  data.forEach(node => {
    let parentNode = nodes.get(node.father_id);
    if (parentNode) {
      parentNode.child_nodes.push(node.node_id);
    }

    node.node_title_styles = nodeTitleStyle({ is_richtxt: node.is_richtxt });
    node.icon_id = nodeTitleHelpers.customIconId(node.is_ro);
  });

  data.forEach(node => {
    node.child_nodes.sort(
      (a, b) => nodes.get(a).sequence - nodes.get(b).sequence,
    );
  });
  return { nodes };
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

export { nodeTitleStyle, rootNode, bufferToPng, organizeData, getPNGSize };
