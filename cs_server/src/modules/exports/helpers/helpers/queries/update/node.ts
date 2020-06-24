import SQL from 'sql-template-strings';
import { aHtmlToCtb } from '../../../../../node/helpers/rendering/mutate/ahtml-to-ctb/ahtml-to-ctb';
import { Node } from '../../../../../node/entities/node.entity';

const updateNode = ({ node }: { node: Node }) => {
  return SQL`UPDATE "main"."node" SET "txt"=${
    aHtmlToCtb(node.node_id)(JSON.parse(node.ahtml)).xmlString
  } WHERE "node"."node_id"=${node.node_id}`;
};

export { updateNode };
