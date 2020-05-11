import { NodeMetaIt } from '::types/graphql/generated';
import { NodeNew } from '::types/graphql/adapters';

const defaultNode = {
  name: '',
  node_title_styles: '{"color":"#ffffff","fontWeight":"normal"}',
  html: '<span class="rich-text__line"/>',
  icon_id: '0',
  read_only: 0,
  child_nodes: [],
  is_richtxt: 1,
  'image({"thumbnail":false})': [],
  'image({"thumbnail":true})': [],
};
const createNode = ({
  highest_node_id,
  documentId,
  father_id,
  previous_sibling_node_id,
}: {
  highest_node_id: number;
  documentId: string;
  meta?: NodeMetaIt;
  father_id: number;
  previous_sibling_node_id: number;
}): NodeNew & { previous_sibling_node_id: number } => {
  const node_id = highest_node_id + 1;
  return {
    ...defaultNode,
    id: `TEMP:${documentId}:${node_id}`,
    node_id,
    documentId,
    father_id,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    previous_sibling_node_id,
  };
};

export { createNode };
