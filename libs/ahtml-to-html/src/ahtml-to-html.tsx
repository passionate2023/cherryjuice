/* eslint-disable no-console */
import { Element, stringifyStyles } from './element';
import { objects } from './objects/objects';
import { LinkAttributes } from './helpers/parse-link';

export type AHtmlNodeAttributes = Record<string, string | number>;
export type AHtmlNode = {
  _?: string;
  $?: AHtmlNodeAttributes;
  type?: string;
  tags?: any[];
};
export type AHtmlLineAttributes = Record<string, any>;
export type AHtmlLine = [(AHtmlObject | AHtmlNode)[], AHtmlLineAttributes];

export type AHtmlObject = AHtmlNode & {
  other_attributes: Record<string, string>;
  linkAttributes?: LinkAttributes;
  table?: { td: string[][]; th: string[] };
  style: { height: string };
};

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
