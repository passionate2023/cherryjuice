import { stringifyStyles } from '../element';

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
  };
};

const Png = ({ styles }: Props) => {
  return `<div style="${stringifyStyles(styles,'margin')} }">
      <img src=""
        alt=""
        style=" width:${styles.width}; height:${styles.height} ;"
      />
    </div>`;
};

export { Png };
