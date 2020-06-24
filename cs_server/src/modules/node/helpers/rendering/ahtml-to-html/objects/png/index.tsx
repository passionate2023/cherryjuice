import { parseLink } from '../../helpers/ctb';
type Props = {
  style: {
    'text-align': string;
    width: string;
    height: string;
  };
  other_attributes: {
    width_raw: number;
    syntax: string;
    is_width_pix: number;
    do_highl_bra: number;
    o_show_linenum: number;
    link?: string;
    id?: string;
  };
};
const addImageLinkProperties = (link: string) => {
  const { 'data-type': dataType, href, target } = parseLink(link);
  return [
    'class="rich-text__image rich-text__image--link rich-text__image--link-' +
      dataType +
      '"',
    'role="link"',
    `data-type="${dataType}"`,
    `data-href="${href}"`,
    `data-target="${target}"`,
    `data-link="${encodeURIComponent(link)}"`,
  ].join(' ');
};

const Png = ({
  style: { width, height },
  other_attributes: { link, id },
}: Props) => {
  return `<img src=""
        alt=""
        style="width:${width}; height:${height};"
        ${
          link ? ` ${addImageLinkProperties(link)}` : 'class="rich-text__image"'
        }${id ? ` data-id="${id}"` : ''}
      />`;
};

export { Png };
