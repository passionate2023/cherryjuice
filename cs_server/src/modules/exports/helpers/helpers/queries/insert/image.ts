import SQL from 'sql-template-strings';
import { LoadedImageRow } from '../../ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/image';

const insertIntoImage = ({
  node_id,
  justification,
  offset,
  png,
}: LoadedImageRow) =>
  SQL`
INSERT INTO "main"."image" 
("node_id", "offset", "justification", "anchor", "png", "filename", "link") 
VALUES 
(${node_id}, ${offset}, ${justification}, '', ${png.buffer}, '', '');`;

export { insertIntoImage };
