import { AHtmlNode } from '../../../../../../../../node/helpers/rendering/ahtml-to-html';
import { CodeboxRow, extractCodeBox } from './objects/codebox';
import { extractGrid, GridRow } from './objects/grid';
import { AnchorRow, extractAnchor } from './objects/anchor';
import { extractImage, UnloadedImageRow } from './objects/image';
import { LinkAttributes } from '../../../../../../../../node/helpers/rendering/ahtml-to-html/helpers/ctb';
import { CTJustification } from '../translate-node/translate-node';

type ObjectType = 'codebox' | 'grid' | 'anchor' | 'image';
type CTBObject = {
  row: CodeboxRow | GridRow | AnchorRow | UnloadedImageRow;
  type: ObjectType;
};
type AHtmlObject = AHtmlNode & {
  other_attributes: Record<string, string>;
  linkAttributes?: LinkAttributes;
  table?: { td: string[][]; th: string[] };
  style: { height: string };
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
export { ObjectType, CTBObject, AHtmlObject };
