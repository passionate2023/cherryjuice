import { CTBObject } from '../translate-object';
import { CTJustification } from '../../translate-node/translate-node';
import { AHtmlObject } from '@cherryjuice/ctb-to-ahtml';

type CodeboxRow = {
  justification: CTJustification;
  txt: string;
  syntax: string;
  width: number;
  height: number;
  is_width_pix: number;
  do_highl_bra: number;
  do_show_linenum: number;
  node_id: number;
  offset: number;
};

const extractCodeBox = (
  node: AHtmlObject,
  node_id: number,
  justification: CTJustification,
): CTBObject => {
  const codeboxRow: CodeboxRow = {
    node_id,
    txt: node._,
    height: +node.style.height.replace('px', ''),
    width: +node.other_attributes.width_raw,
    justification,
    do_highl_bra: +node.other_attributes.do_highl_bra,
    is_width_pix: +node.other_attributes.is_width_pix,
    syntax: node.other_attributes.syntax,
    do_show_linenum: 1,
    offset: 0,
  };
  return {
    row: codeboxRow,
    type: 'codebox',
  };
};
export { extractCodeBox };
export { CodeboxRow };
