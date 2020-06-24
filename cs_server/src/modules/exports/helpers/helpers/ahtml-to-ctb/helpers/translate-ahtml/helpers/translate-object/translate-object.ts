import { AHtmlNode } from '../../../../../../../../node/helpers/rendering/ahtml-to-html';
import { CodeboxRow, extractCodeBox } from './objects/codebox';
import { extractGrid, GridRow } from './objects/grid';

type ObjectType = 'codebox' | 'grid';
type CTBObject = { row: CodeboxRow | GridRow; type: ObjectType };
type AHtmlObject = AHtmlNode & {
  other_attributes: Record<string, string>;
  table?: { td: string[][]; th: string[] };
};

const translateObject = ({ node, node_id }) => {
  const newNode: AHtmlNode = {};
  if (node.type === 'png') {
    newNode['type'] = 'png';
    newNode['$'] = {
      justification: 'left',
      height: node.$['height'],
      width: node.$['width'],
    };
    newNode['other_attributes'] = {
      ...node.other_attributes,
    };
  }
  if (node.type === 'table') {
    return extractGrid(node, node_id);
  } else if (node.type === 'code') {
    return extractCodeBox(node, node_id);
  }
  return newNode;
};

export { translateObject };
export { ObjectType, CTBObject, AHtmlObject };
