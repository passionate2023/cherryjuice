import { CodeboxRow, extractCodeBox } from './objects/codebox';
import { extractGrid, GridRow } from './objects/grid';
import { AnchorRow, extractAnchor } from './objects/anchor';
import { extractImage, UnloadedImageRow } from './objects/image';
import { CTJustification } from '../translate-node/translate-node';
import { AHtmlObject } from '@cherryjuice/ctb-to-ahtml';

type ObjectType = 'codebox' | 'grid' | 'anchor' | 'image';
type CTBObject = {
  row: CodeboxRow | GridRow | AnchorRow | UnloadedImageRow;
  type: ObjectType;
};

const translateObject = ({
  node,
  node_id,
  justification,
}: {
  node: AHtmlObject;
  node_id: number;
  justification: CTJustification;
}) => {
  if (node.type === 'png') {
    return extractImage(node, node_id, justification);
  } else if (node.type === 'table') {
    return extractGrid(node, node_id, justification);
  } else if (node.type === 'anchor') {
    return extractAnchor(node, node_id, justification);
  } else if (node.type === 'code') {
    return extractCodeBox(node, node_id, justification);
  }
};

export { translateObject };
export { ObjectType, CTBObject };
