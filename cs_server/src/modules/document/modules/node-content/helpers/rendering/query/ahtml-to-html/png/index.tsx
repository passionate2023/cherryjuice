import { stringifyStyles } from '../element';
import { xmlAttributesToCssUtils } from '../../ctb-to-ahtml/steps/translate-attributes-to-html-and-css';

type Props = {
  styles: {
    'text-align': string;
    width: string;
    height: string;
  };
  other_attributes: {
    width_raw: number;
    offset: number;
    syntax: string;
    is_width_pix: number;
    do_highl_bra: number;
    o_show_linenum: number;
    link?: string;
  };
};
const addImageLinkProperties = (link: string) => {
  const attributes = xmlAttributesToCssUtils.parseLink(link);
  return [
    Object.entries(xmlAttributesToCssUtils.parseLink(link))
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' '),
    'role="link"',
    'class="rich-text__image--link rich-text__image--link-' +
      attributes.type +
      '"',
  ].join(' ');
};

const Png = ({ styles, other_attributes: { offset, link } }: Props) => {
  return `<img src=""
        alt=""
        style=" width:${styles.width}; height:${
    styles.height
  } ;${stringifyStyles(styles, 'margin')} "
        data-offset="${offset}"${link ? ` ${addImageLinkProperties(link)}` : ''}
      />`;
};

export { Png };
