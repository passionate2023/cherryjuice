import { AHtmlNode } from '../../../../../../../../../node/helpers/rendering/ahtml-to-html';
import { ObjectType } from '../translate-object';

type CodeboxRow = {
  justification: 'left';
  txt: string;
  syntax: string;
  width: number;
  height: number;
  is_width_pix: number;
  do_highl_bra: number;
  do_show_linenum: number;
};

type TranslatedObject = { row: CodeboxRow; type: ObjectType };
const extractCodeBox = (
  node: AHtmlNode & { other_attributes: Record<string, string> },
): TranslatedObject => {
  const codeboxRow: CodeboxRow = {
    txt: node._,
    height: +node.$.height,
    width: +node.$.width,
    justification: 'left',
    do_highl_bra: +node.other_attributes.do_highl_bra,
    is_width_pix: +node.other_attributes.is_width_pix,
    syntax: node.other_attributes.syntax,
    do_show_linenum: 1,
  };
  return {
    row: codeboxRow,
    type: 'codebox',
  };
};
export { extractCodeBox };
export { CodeboxRow, TranslatedObject };
