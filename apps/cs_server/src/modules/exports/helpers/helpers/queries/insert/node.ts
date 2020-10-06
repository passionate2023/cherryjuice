import SQL from 'sql-template-strings';
import {
  adaptNodeStyle,
  adaptNodeTime,
} from '../../adapt-node-meta/adapt-node-meta';
import { Node } from '../../../../../node/entities/node.entity';

const insertIntoNode = ({
  node: { node_id, name, createdAt, updatedAt, node_title_styles, read_only },
  txt,
  hasObjects: { codebox, grid, anchor, image },
}: {
  node: Node;
  txt: string;
  hasObjects: {
    codebox: 1 | 0;
    grid: 1 | 0;
    anchor: 1 | 0;
    image: 1 | 0;
  };
}) => {
  const { is_ro, is_richtxt } = adaptNodeStyle(node_title_styles, !!read_only);

  return SQL`
    INSERT INTO "main"."node"  (
    "node_id", "name", "txt", "syntax","tags", "is_ro", "is_richtxt", "has_codebox", "has_table", "has_image", "level","ts_creation","ts_lastsave"
    ) VALUES (
    ${node_id}, ${name}, 
    ${txt}, 'custom-colors', '', ${is_ro}, ${is_richtxt}, ${codebox}, ${grid}, ${anchor |
    image}, '0',
    ${adaptNodeTime(createdAt)},${adaptNodeTime(updatedAt)}
    )`;
};

export { insertIntoNode };
