import { stringifyStyles } from '../element';

const Link = ({ href, target, text, type, style }) => {
  return `<a href=${href} style=${stringifyStyles(style)} 
data-type="${type}"
target=${target} class="rich-text__link rich-text__link--${type}">
      ${text}
    </a>`;
};

export { Link };
