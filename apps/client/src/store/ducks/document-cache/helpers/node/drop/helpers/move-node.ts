import { mutateNodeMeta } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';

type Props = {
  copiedNode: QFullNode;
  newFatherNode: QFullNode;
  oldFatherNode: QFullNode;
  newIndex: number;
};

export const moveNode = (
  state: DocumentCacheState,
  { copiedNode, newFatherNode, oldFatherNode, newIndex }: Props,
) => {
  const newFatherChildNodes = newFatherNode.child_nodes.slice();
  newFatherChildNodes.splice(newIndex, 0, copiedNode.node_id);
  mutateNodeMeta(state, [
    {
      node_id: copiedNode.node_id,
      documentId: copiedNode.documentId,
      data: {
        fatherId: newFatherNode.id,
        father_id: newFatherNode.node_id,
      },
    },
    {
      node_id: newFatherNode.node_id,
      documentId: newFatherNode.documentId,
      data: {
        child_nodes: newFatherChildNodes,
      },
    },
    {
      node_id: oldFatherNode.node_id,
      documentId: oldFatherNode.documentId,
      data: {
        child_nodes: oldFatherNode.child_nodes.filter(
          _node_id => _node_id !== copiedNode.node_id,
        ),
      },
    },
  ]);
};
