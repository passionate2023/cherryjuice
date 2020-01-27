type Props = { href: string; target: string; text: string };

const Link = ({ href, target, text }) => {
  return target === '_blank' || target === 'node'
    ? `<a class="rich-text__link" href=${href} target=${target}>
      ${text}
    </a>`
    : text;
};

export { Link };
