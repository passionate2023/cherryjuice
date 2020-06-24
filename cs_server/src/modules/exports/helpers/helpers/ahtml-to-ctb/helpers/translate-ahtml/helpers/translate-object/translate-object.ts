import { AHtmlNode } from '../../../../../../../../node/helpers/rendering/ahtml-to-html';
import { CodeboxRow, extractCodeBox } from './objects/codebox';
import { extractGrid, GridRow } from './objects/grid';
import { AnchorRow, extractAnchor } from './objects/anchor';
import { extractImage,  UnloadedImageRow } from './objects/image';

type ObjectType = 'codebox' | 'grid' | 'anchor' | 'image';
type CTBObject = {
  row: CodeboxRow | GridRow | AnchorRow | UnloadedImageRow;
  type: ObjectType;
};
type AHtmlObject = AHtmlNode & {
  other_attributes: Record<string, string>;
  table?: { td: string[][]; th: string[] };
};

const translateObject = ({ node, node_id }) => {
  if (node.type === 'png') {
    return extractImage(node, node_id);
  } else if (node.type === 'table') {
    return extractGrid(node, node_id);
  } else if (node.type === 'anchor') {
    return extractAnchor(node, node_id);
  } else if (node.type === 'code') {
    return extractCodeBox(node, node_id);
  }
};

export { translateObject };
export { ObjectType, CTBObject, AHtmlObject };
