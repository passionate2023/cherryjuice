import { LinkAttributes } from '../../helpers/parse-link';

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
    id?: string;
  };
  linkAttributes?: LinkAttributes;
};
const addImageLinkProperties = ({
  'data-type': dataType,
  href,
  target,
}: LinkAttributes) => {
  return [
    'class="rich-text__image rich-text__image--link rich-text__image--link-' +
      dataType +
      '"',
    'role="link"',
    `data-type="${dataType}"`,
    `data-href="${href}"`,
    `data-target="${target}"`,
  ].join(' ');
};

const Png = ({
  style: { width, height },
  other_attributes: { id },
  linkAttributes,
}: Props) => {
  return `<img src=""
        alt=""
        style="width:${width}; height:${height};"
        ${
          linkAttributes
            ? ` ${addImageLinkProperties(linkAttributes)}`
            : 'class="rich-text__image"'
        }${id ? ` data-id="${id}"` : ''}
      />`;
};

export { Png };
