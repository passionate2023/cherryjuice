import { Link as CtLink } from '../link';

const stringifyStyles = (style = {}, onlyStylesThatStartWith = undefined) =>
  Object.entries(style)
    .filter(([key]) =>
      onlyStylesThatStartWith ? key.startsWith(onlyStylesThatStartWith) : true
    )
    .map(([key, value]) => `${key}:${value}`)
    .join(';') + ';';
const createElement = (tag, attributes, children) =>
  `<${tag} class="rich-text__text" ${Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')}>${children}</${tag}>`;

const Element = ({ node }) =>
  node.tags.length
    ? node.tags.reduceRight((acc, val, i, arr) => {
        return val[0] === 'a'
          ? CtLink({
              // todo use createElement for both both
              target: val[1].target,
              href: val[1].href,
              type: val[1].type,
              text: node._,
              style: node.$
            })
          : createElement(`${val[0]}`, val[1], acc);
      }, node._)
    : createElement(`div`, node.$, node._);

export { Element, stringifyStyles };
