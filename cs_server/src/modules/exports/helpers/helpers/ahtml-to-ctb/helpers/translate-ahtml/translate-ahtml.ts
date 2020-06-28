import {
  AHtmlLine,
  AHtmlNode,
} from '../../../../../../node/helpers/rendering/ahtml-to-html';
import {
  AHtmlObject,
  CTBObject,
  translateObject,
} from './helpers/translate-object/translate-object';
import {
  CTJustification,
  translateNode,
} from './helpers/translate-node/translate-node';
import { reverseJustificationMap } from '../../../../../../node/helpers/rendering/ctb-to-ahtml/steps/translate-attributes-to-html-and-css';

const translateAHtml = (node_id: number) => (
  aHtmls: AHtmlLine[],
): (CTBObject | AHtmlNode)[] => {
  const translatedAHtmls = aHtmls.flatMap(([line, lineStyle]) => {
    let justification: CTJustification = 'left';
    if (lineStyle && lineStyle['text-align']) {
      justification =
        reverseJustificationMap['text-align'][lineStyle['text-align']];
    }
    return [
      ...line.map(node => {
        if (node.type)
          return translateObject({
            node: node as AHtmlObject,
            node_id,
            justification,
          });
        else if (typeof node === 'object')
          return translateNode({ node, justification });
        else return node;
      }),
      { _: '\n', tags: [] },
    ];
  });
  const trail = translatedAHtmls[translatedAHtmls.length - 1];
  // @ts-ignore
  if (trail?._ === '\n' && trail.tags.length === 0) {
    translatedAHtmls.pop();
  }
  return translatedAHtmls;
};

export { translateAHtml };
