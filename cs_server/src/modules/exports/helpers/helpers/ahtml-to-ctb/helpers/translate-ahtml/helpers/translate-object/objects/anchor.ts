import { AHtmlObject, CTBObject } from '../translate-object';

type AnchorRow = {
  node_id: number;
  justification: 'left';
  offset: number;
  anchor: string;
};

const translateAnchorId = (id: string) => {
  if (id.startsWith('#')) id = id.substring(1);
  return id;
};

const extractAnchor = (node: AHtmlObject, node_id: number): CTBObject => {
  const row: AnchorRow = {
    node_id,
    justification: 'left',
    offset: 0,
    anchor: translateAnchorId(node.other_attributes.id),
  };
  return {
    row,
    type: 'anchor',
  };
};

export { extractAnchor };
export { AnchorRow };
