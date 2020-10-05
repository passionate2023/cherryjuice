import SQL from 'sql-template-strings';
import { AnchorRow } from '../../ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/anchor';

const insertIntoAnchor = ({
  node_id,
  justification,
  offset,
  anchor,
}: AnchorRow) =>
  SQL`
INSERT INTO "main"."image" 
("node_id", "offset", "justification", "anchor") 
VALUES 
(${node_id}, ${offset}, ${justification}, ${anchor});`;

export { insertIntoAnchor };
