/* eslint-disable no-console */
import { Element, stringifyStyles } from './element';
import { objects } from './objects/objects';
import {AHtmlLine }from '@cherryjuice/ctb-to-ahtml'

export const aHtmlToHtml = (ahtml: AHtmlLine[]) => {
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
