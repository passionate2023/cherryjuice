import SQL from 'sql-template-strings';
import { Node } from '../../../../../node/entities/node.entity';

const insertIntoChildren = ({
  node: { node_id, father_id },
  sequence,
}: {
  node: Node;
  sequence: number;
}) => {
  return SQL`
      INSERT INTO "main"."children" (
      "node_id", "father_id", "sequence"
      ) VALUES  (
      ${node_id}, ${father_id}, ${sequence}
      )`;
};

export { insertIntoChildren };
