import { CTBObject } from '../translate-object';
import { CTJustification } from '../../translate-node/translate-node';
import { AHtmlObject } from '@cherryjuice/ahtml-to-html';

type AnchorRow = {
  node_id: number;
  justification: CTJustification;
  offset: number;
  anchor: string;
};

const translateAnchorId = (id: string) => {
  if (id.startsWith('#')) id = id.substring(1);
  return id;
};

const extractAnchor = (
  node: AHtmlObject,
  node_id: number,
  justification: CTJustification,
): CTBObject => {
  const row: AnchorRow = {
    node_id,
    justification,
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
