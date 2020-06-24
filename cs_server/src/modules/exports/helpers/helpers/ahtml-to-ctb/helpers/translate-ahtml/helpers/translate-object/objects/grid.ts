
import { AHtmlObject, CTBObject } from '../translate-object';

type GridRow = {
  node_id: number;
  offset: number;
  justification: 'left';
  txt: string;
  col_min: number;
  col_max: number;
};

const extractGrid = (node: AHtmlObject, node_id: number): CTBObject => {
  const row: GridRow = {
    node_id,
    justification: 'left',
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
