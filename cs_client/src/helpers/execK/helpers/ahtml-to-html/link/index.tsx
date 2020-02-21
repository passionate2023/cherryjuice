import { stringifyStyles } from '../element';

const Link = ({ href, target, text, type, style }, children) => {
  return `<a href=${href} style=${
    typeof style === 'string' ? style : stringifyStyles(style)
  } data-type="${type}" target=${target} class="rich-text__link rich-text__link--${type}">${
    children ? children : text
  }</a>`;
};

export { Link };
