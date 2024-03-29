import { escapeHtml } from '../helpers/escape-html';
import { AHtmlNode } from '@cherryjuice/ctb-to-ahtml';

const stringifyStyles = (style = {}, onlyStylesThatStartWith = undefined) =>
  (
    Object.entries(style)
      .filter(([key]) =>
        onlyStylesThatStartWith
          ? key.startsWith(onlyStylesThatStartWith)
          : true,
      )
      .map(([key, value]) => `${key}:${value}`)
      .join(';') + ';'.replace('"', '"')
  )
    .replace(/;\s*;/g, ';')
    .replace(/^;$/, '');

const createElement = (tag, attributes, children) => {
  const attributesPairs = Object.entries(attributes).map(([key, value]) =>
    key === 'style' && Object.keys(value).length === 0
      ? ''
      : `${key}="${key === 'style' ? stringifyStyles(value) : value}"`,
  );
  return `<${tag}${`${`${
    attributesPairs.length ? ' ' : ''
  }${attributesPairs.join(' ')}`}`}>${children}</${tag}>`;
};

const Element = (node: AHtmlNode) =>
  node?.tags?.length
    ? node.tags.reduceRight((acc, [tagName, attributes]) => {
        const isAnchor = tagName === 'a' && node['other_attributes'];
        const elementAttributes = isAnchor
          ? node['other_attributes']
          : attributes;
        if (isAnchor && attributes?.style)
          elementAttributes.style = attributes.style;
        return createElement(`${tagName}`, elementAttributes, acc);
      }, escapeHtml(node._))
    : createElement(
        `span`,
        {},
        escapeHtml(typeof node === 'string' ? node : node._),
      );

export { Element, stringifyStyles };
