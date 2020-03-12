import { Link as CtLink } from '../link';

const stringifyStyles = (style = {}, onlyStylesThatStartWith = undefined) =>
  (
    Object.entries(style)
      .filter(([key]) =>
        onlyStylesThatStartWith ? key.startsWith(onlyStylesThatStartWith) : true
      )
      .map(([key, value]) => `${key}:${value}`)
      .join(';') + ';'.replace('"', '"')
  )
    .replace(/;\s*;/g, ';')
    .replace(/^;$/, '');
const createElement = (tag, attributes, children) =>
  `<${tag} ${attributes &&
    Object.entries(attributes)
      .map(([key, value]) =>
        key === 'style' && Object.keys(value).length === 0
          ? ''
          : `${key}='${key === 'style' ? stringifyStyles(value) : value}'`
      )
      .join(' ')}>${children}</${tag}>`;

const Element = ({ node }) =>
  node.tags.length
    ? node.tags.reduceRight((acc, val, i, arr) => {
        return val[0] === 'a'
          ? CtLink(
              {
                // todo use createElement for both both
                target: val[1].target,
                href: val[1].href,
                type: val[1]['data-type'],
                text: node._,
                style: stringifyStyles(val[1].style)
              },
              acc
            )
          : createElement(`${val[0]}`, val[1], acc);
      }, node._)
    : createElement(`span`, {}, node._);

const aHtmlToElement = ({ node }) =>
  node.type ? node.outerHTML : Element({ node });
export { Element, stringifyStyles, aHtmlToElement };
