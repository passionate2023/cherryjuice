import {
  AHtmlLine,
  AHtmlNode,
} from '../../../../../../node/helpers/rendering/ahtml-to-html';
import { translateObject } from './helpers/translate-object/translate-object';
import { translateNode } from './helpers/translate-node/translate-node';

const translateAHtml = (node_id: number) => (
  aHtmls: AHtmlLine[],
): AHtmlNode[] => {
  const translatedAHtmls = aHtmls.flatMap(([line]) => [
    ...line.map(node => {
      if (node.type) node = translateObject({ node, node_id });
      else if (typeof node === 'object') node = translateNode({ node });
      return node;
    }),
    { _: '\n', tags: [] },
  ]);
  const trail = translatedAHtmls[translatedAHtmls.length - 1];
  if (trail._ === '\n' && trail.tags.length === 0) {
    translatedAHtmls.pop();
  }
  return translatedAHtmls;
};

export { translateAHtml };
