/* eslint-disable no-console */
import { Element, stringifyStyles } from './element';
import { objects } from './objects/objects';

const aHtmlToHtml = (
  ahtml: { nodes: Record<string, any>[]; style: Record<string, any>[] }[],
) => {
  let res = '<span class="rich-text__line"></span>';
  if (ahtml.length)
    try {
      res = `${ahtml
        .map(
          line =>
            `<span class="rich-text__line"${
              line.style ? `style="${stringifyStyles(line.style)}"` : ''
            }>${line.nodes
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
