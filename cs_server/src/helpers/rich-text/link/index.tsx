type Props = { href: string; target: string; text: string };

const Link = ({ href, target, text, type }) => {
  return `<a href=${href} target=${target} class="rich-text__link rich-text__link--${type}">
      ${text}
    </a>`;
};

export { Link };
