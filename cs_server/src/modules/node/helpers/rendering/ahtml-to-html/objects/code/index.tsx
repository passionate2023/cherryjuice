type Props = {
  style: {
    justification: string;
    width: string;
    height: string;
  };
  other_attributes: {
    width_raw: number;
    offset: number;
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
  },
}: Props) => {
  return `<code
      class="rich-text__code"
      data-do_highl_bra="${do_highl_bra}" 
      data-is_width_pix="${is_width_pix}"
      data-is_width_pix="${is_width_pix}"
      data-do_show_linenum="${do_show_linenum}"
      data-width_raw="${width_raw}"
      data-syntax= "${syntax}"
      style="max-width: ${width_raw}${is_width_pix ? 'px' : '%'};
        min-height: ${height};
        width: ${width_raw}${is_width_pix ? 'px' : '%'};
        display: inline-block;"
    >
      ${text}
    </code><span>&#8203;</span>`;
};

export { Code };
