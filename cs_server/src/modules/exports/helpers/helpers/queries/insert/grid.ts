import SQL from 'sql-template-strings';
import { GridRow } from '../../ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/grid';

const insertIntoGrid = ({
  node_id,
  justification,
  txt,
  col_min,
  col_max,
  offset,
}: GridRow) => {
  return SQL`
    INSERT INTO "main"."grid" 
    ("node_id", "offset", "justification", "txt", "col_min", "col_max") 
    VALUES 
    (${node_id}, ${offset}, ${justification}, ${txt}, ${col_min}, ${col_max});`;
};

export { insertIntoGrid };
