import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { newNodePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

type Props = {
  newDocumentId: string;
  new_node_id: number;
  newFatherNode_id: number;
  newFatherNodeId: string;
  copiedNode: QFullNode;
};

export const createCloneNode = ({
  newDocumentId,
  copiedNode,
  new_node_id,
  newFatherNode_id,
  newFatherNodeId,
}: Props): QFullNode => {
  return {
    documentId: newDocumentId,
    id: `${newNodePrefix}${newDocumentId}:${new_node_id}`,
    node_id: new_node_id,
    fatherId: newFatherNodeId,
    father_id: newFatherNode_id,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    tags: copiedNode.tags,
    read_only: copiedNode.read_only,
    node_title_styles: copiedNode.node_title_styles,
    child_nodes: [],
    html: '',
    image: [],
    name: copiedNode.name,
    privacy: copiedNode.privacy,
  };
};
