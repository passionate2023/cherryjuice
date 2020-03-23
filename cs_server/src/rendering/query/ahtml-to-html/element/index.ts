import { Link as CtLink } from '../link';
const stringifyStyles = (style, onlyStylesThatStartWith = undefined) =>
  Object.entries(style)
    .filter(([key]) =>
      onlyStylesThatStartWith ? key.startsWith(onlyStylesThatStartWith) : true,
    )
    .map(([key, value]) => `${key}:${value}`)
    .join(';') + ';';

const createElement = (tag, style, children) =>
  `<${tag} class="rich-text__text" style="${stringifyStyles(
    style,
  )}">${children}</${tag}>`;

const Element = ({ node }) =>
  node.tags.length
    ? node.tags.reduce((acc, val, i, arr) => {
        return typeof val === 'string'
          ? createElement(`${val}`, i === arr.length - 1 && node.$, acc)
          : // render links
            CtLink({
              target: val[1].target,
              href: val[1].href,
              type: val[1].type,
              text: node._,
              style:node.$
            });
      }, node._)
    : createElement(`span`, node.$, node._);

export { Element, stringifyStyles };