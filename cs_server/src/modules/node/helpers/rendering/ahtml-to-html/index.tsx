/* eslint-disable no-console */
import { Element, stringifyStyles } from './element';
import { objects } from './objects/objects';
import { AHtmlObject } from '../../../../exports/helpers/helpers/ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/translate-object';

type AHtmlNodeAttributes = Record<string, string | number>;
type AHtmlNode = {
  _?: string;
  $?: AHtmlNodeAttributes;
  type?: string;
  tags?: any[];
};
type AHtmlLineAttributes = Record<string, any>;
type AHtmlLine = [(AHtmlObject | AHtmlNode)[], AHtmlLineAttributes];
const aHtmlToHtml = (ahtml: AHtmlLine[]) => {
  let res = '<span class="rich-text__line"></span>';
  if (ahtml.length)
    try {
      res = `${ahtml
        .map(
          ([nodes, style]) =>
            `<span class="rich-text__line"${
              style ? `style="${stringifyStyles(style)}"` : ''
            }>${nodes
              .map(node =>
                node.type ? objects[node.type](node) : Element(node),
              )
              .join('')}${'</span>'}`,
        )
        .join('')}`;
    } catch (e) {
      console.error(e);
    }
  return res;
};

export { aHtmlToHtml, Element };
export { AHtmlLine, AHtmlNode, AHtmlNodeAttributes, AHtmlLineAttributes };
