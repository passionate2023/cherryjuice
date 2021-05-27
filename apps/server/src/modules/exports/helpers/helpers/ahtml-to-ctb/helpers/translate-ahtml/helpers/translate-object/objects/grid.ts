import { CTBObject } from '../translate-object';
import { CTJustification } from '../../translate-node/translate-node';
import { AHtmlObject } from '@cherryjuice/ahtml-to-html';

type GridRow = {
  node_id: number;
  offset: number;
  justification: CTJustification;
  txt: string;
  col_min: number;
  col_max: number;
};

const extractGrid = (
  node: AHtmlObject,
  node_id: number,
  justification: CTJustification,
): CTBObject => {
  const row: GridRow = {
    node_id,
    justification,
    offset: 0,
    txt: `<table>${[...node.table.td, node.table.th]
      .map(
        row => `<row>${row.map(cell => `<cell>${cell}</cell>`).join('')}</row>`,
      )
      .join('')}</table>`,
    col_min: +node.other_attributes.col_min_width,
    col_max: +node.other_attributes.col_max_width,
  };
  return {
    row,
    type: 'grid',
  };
};

export { extractGrid };
export { GridRow };
