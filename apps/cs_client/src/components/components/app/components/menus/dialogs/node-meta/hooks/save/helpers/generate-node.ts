import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { newNodePrefix } from '::root/components/editor/components/content-editable/hooks/add-meta-to-pasted-images';
import { NodeMeta } from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import {
  calculateNewStyle,
  joinTags,
} from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/edit-node';

const defaultNode = {
  name: '',
  node_title_styles: '{"color":"#ffffff","fontWeight":"normal","icon_id":0}',
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
    name: nodeBMeta.name || '?',
    node_title_styles: calculateNewStyle(nodeBMeta),
    read_only: nodeBMeta.isReadOnly ? 1 : 0,
    child_nodes: [],
    privacy: nodeBMeta.privacy,
    tags: joinTags(nodeBMeta.tags),
  };
};

export { generateNode };
