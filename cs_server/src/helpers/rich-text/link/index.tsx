import { stringifyStyles } from '../element';

type Props = { href: string; target: string; text: string; style: string };

const Link = ({ href, target, text, type, style }) => {
  console.log('link', style);
  return `<a href=${href} style=${stringifyStyles(
    style,
  )} target=${target} class="rich-text__link rich-text__link--${type}">
      ${text}
    </a>`;
};

export { Link };
