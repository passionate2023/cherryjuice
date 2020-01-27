import modCode from '::sass-modules/code.scss';
import * as React from 'react';

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
// todo fix justification
const Code: React.FC<Props> = ({
  text,
  styles: { height, width },
  other_attributes: { is_width_pix, width_raw }
}) => {
  console.log(`${width_raw}${is_width_pix ? 'px' : '%'}`);
  return (
    <code
      className={modCode.code}
      style={{
        maxWidth: `${width_raw}${is_width_pix ? 'px' : '%'}`,
        width: `${width_raw}${is_width_pix ? 'px' : '%'}`,
        minHeight: height,

        display: 'inline-block'
      }}
    >
      {text}
    </code>
  );
};

export { Code };
