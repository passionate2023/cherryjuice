import { escapeHtml } from '../helpers/escape-html';

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

const Element = node =>
  node?.tags?.length
    ? node.tags.reduceRight((acc, [tagName, attributes]) => {
        return createElement(`${tagName}`, attributes, acc);
      }, escapeHtml(node._))
    : createElement(
        `span`,
        {},
        escapeHtml(typeof node === 'string' ? node : node._),
      );

export { Element, stringifyStyles };
