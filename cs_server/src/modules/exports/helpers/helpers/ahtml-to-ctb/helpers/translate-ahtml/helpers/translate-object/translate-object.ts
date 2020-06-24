import { AHtmlNode } from '../../../../../../../../node/helpers/rendering/ahtml-to-html';
import { extractCodeBox } from './objects/codebox';
type ObjectType = 'codebox';
const translateObject = ({ node }) => {
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
    newNode['type'] = 'table';
    newNode['$'] = {
      justification: 'left',
    };
    newNode['other_attributes'] = {
      ...node.other_attributes,
    };
    newNode['table'] = {
      th: node.thead.split('\n')[0].split('\t'),
      td: node.tbody.split('\n').map(line => line.split('\t')),
    };
  } else if (node.type === 'code') {
    return extractCodeBox(node);
  }
  return newNode;
};

export { translateObject };
export { ObjectType };
