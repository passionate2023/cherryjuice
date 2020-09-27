import { NodeMetaIt } from '::types/graphql';
import { QFullNode } from '::store/ducks/cache/document-cache';

const defaultNode = {
  name: '',
  node_title_styles: '{"color":"#ffffff","fontWeight":"normal","icon_id":0}',
  html: '<span class="rich-text__line"/>',
  read_only: 0,
  child_nodes: [],
  image: [],
};
const createNode = ({
  highestNode_id,
  documentId,
  father_id,
  fatherId,
}: {
  highestNode_id: number;
  documentId: string;
  meta?: NodeMetaIt;
  father_id: number;
  fatherId: string;
}): QFullNode => {
  const node_id = highestNode_id + 1;
  return {
    ...defaultNode,
    id: `TEMP:${documentId}:${node_id}`,
    node_id,
    documentId,
    father_id,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    fatherId,
  };
};

export { createNode };
