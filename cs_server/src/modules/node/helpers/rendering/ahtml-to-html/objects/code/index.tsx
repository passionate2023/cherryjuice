import { escapeHtml } from '../../helpers/escape-html';

const emptySpace = '&#8203;';
const objectDelimiter = `<span>${emptySpace}</span>`;

type Props = {
  style: {
    height: string;
  };
  other_attributes: {
    fixedHeight?: boolean;
    width_raw: number;
    syntax: string;
    is_width_pix: number;
    do_highl_bra: number;
    do_show_linenum: number;
  };
  _: string;
};
const Code = ({
  style: { height },
  _: text,
  other_attributes: {
    is_width_pix,
    width_raw,
    do_highl_bra,
    syntax,
    do_show_linenum,
    fixedHeight = true,
  },
}: Props) => {
  return `${objectDelimiter}<code
      class="rich-text__code"
      data-do_highl_bra="${do_highl_bra}" 
      data-is_width_pix="${is_width_pix}"
      data-do_show_linenum="${do_show_linenum}"
      data-width_raw="${width_raw}"
      data-syntax= "${syntax}"
      style="
        max-width: ${width_raw}${is_width_pix ? 'px' : '%'};
        width: ${width_raw}${is_width_pix ? 'px' : '%'};
        min-height: ${height};
        ${fixedHeight ? `height: ${height};` : ''}"
    >
      ${text
        .split('\n')
        .map(
          line =>
            `<span class="rich-text__code__line">${
              line ? escapeHtml(line) : emptySpace
            }</span>`,
        )
        .join('')}
    </code>${objectDelimiter}`;
};

export { Code, objectDelimiter };
