import {
  AHtmlLine,
  AHtmlNode,
} from '../../../../../../node/helpers/rendering/ahtml-to-html';
import { translateObject } from './helpers/translate-object/translate-object';
import { translateNode } from './helpers/translate-node/translate-node';

const translateAHtml = (node_id: number)=>(aHtmls: AHtmlLine[]): AHtmlNode[] =>
  aHtmls.flatMap(([line]) => {
    return [
      ...line.map(node => {
        if (node.type) node = translateObject({ node,node_id });
        else if (typeof node === 'object') node = translateNode({ node });
        return node;
      }),
      { _: '\n', tags: [] },
    ];
  });

export { translateAHtml };
