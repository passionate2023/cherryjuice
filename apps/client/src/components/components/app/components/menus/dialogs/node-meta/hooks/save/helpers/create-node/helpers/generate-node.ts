import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { newNodePrefix } from '@cherryjuice/editor';
import { NodeMeta } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { joinTags } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/helpers/join-tags';
import { stringifyNodeStyle } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/helpers/stringify-node-style';

const defaultNode = {
  name: '',
  node_title_styles: null,
  html: '<span class="rich-text__line"/>',
  read_only: 0,
  child_nodes: [],
  image: [],
};
const generateNode = ({
  highestNode_id,
  documentId,
  father_id,
  fatherId,
  nodeBMeta,
}: {
  highestNode_id: number;
  documentId: string;
  father_id: number;
  fatherId: string;
  nodeBMeta: NodeMeta;
}): QFullNode => {
  const node_id = highestNode_id + 1;
  return {
    ...defaultNode,
    id: `${newNodePrefix}${documentId}:${node_id}`,
    node_id,
    documentId,
    father_id,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    fatherId,
    name: nodeBMeta.name || '',
    node_title_styles: stringifyNodeStyle(nodeBMeta),
    read_only: nodeBMeta.isReadOnly ? 1 : 0,
    child_nodes: [],
    privacy: nodeBMeta.privacy,
    tags: joinTags(nodeBMeta.tags),
  };
};

export { generateNode };
