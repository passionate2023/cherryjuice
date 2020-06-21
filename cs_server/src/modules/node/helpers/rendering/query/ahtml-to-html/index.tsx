/* eslint-disable no-console */
import { Element, stringifyStyles } from './element';
import { objects } from './objects/objects';

type AHtml = [Record<string, any>[], Record<string, any>[]];
const aHtmlToHtml = (ahtml: AHtml[]) => {
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
export { AHtml };
