import { CodeboxRow } from '../../ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/codebox';
import SQL from 'sql-template-strings';
const insertIntoCodeBox = ({
  node_id,
  justification,
  txt,
  syntax,
  width,
  height,
  is_width_pix,
  do_highl_bra,
  do_show_linenum,
  offset,
}: CodeboxRow & { node_id: number; offset: string }) => {
  return SQL`
     INSERT INTO "main"."codebox" (
     "node_id","offset", "justification", "txt", "syntax", "width", "height", "is_width_pix", "do_highl_bra", "do_show_linenum"
     ) VALUES (
     ${node_id}, ${offset},${justification}, ${txt}, ${syntax}, ${width}, ${height}, ${is_width_pix}, ${do_highl_bra}, ${do_show_linenum});`;
};

export { insertIntoCodeBox };
