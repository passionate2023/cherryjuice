import { Link as CtLink } from '../link';

const createElement = (tag, style, children) =>
  `<${tag} style="${Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}">${children}</${tag}>`;

const Element = ({ node }) =>
  node.tags.reduce((acc, val, i, arr) => {
    if (typeof val !== 'string') console.log('val', val);
    return typeof val === 'string'
      ? createElement(
          `${val}`,
          i === arr.length - 1 && { ...node.$, display: 'inline' },
          acc,
        )
      : CtLink({
          target: val[1].target,
          href: val[1].href,
          text: node._,
        });
  }, node._);

export { Element };
