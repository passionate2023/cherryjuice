type Props = {
  styles: {
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
    o_show_linenum: number;
  };
  text: string;
};
const Code = ({
  text,
  styles: { height, width },
  other_attributes: { is_width_pix, width_raw },
}) => {
  return `<code
      class="rich-text__code"
      style="max-width: ${width_raw}${is_width_pix ? 'px' : '%'};
        min-height: ${height};
        width: ${width_raw}${is_width_pix ? 'px' : '%'};
        display: inline-block" 
    >
      ${text}
    </code>`;
};

export { Code };
