import { AHtmlLine, AHtmlNode } from '../../../../query/ahtml-to-html';
import { translateObject } from './helpers/translate-object/translate-object';
import { translateNode } from './helpers/translate-node/translate-node';

const translateAHtml = (aHtmls: AHtmlLine[]): AHtmlNode[] =>
  aHtmls.flatMap(([line]) => {
    return [
      ...line.map(node => {
        if (node.type) node = translateObject({ node });
        else if (typeof node === 'object') node = translateNode({ node });
        return node;
      }),
      { _: '\n', tags: [] },
    ];
  });

export { translateAHtml };
