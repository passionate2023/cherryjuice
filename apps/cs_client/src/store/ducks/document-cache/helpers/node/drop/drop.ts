import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { OnDropParam } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { mutateNodeMeta } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { moveNode } from '::store/ducks/document-cache/helpers/node/drop/helpers/move-node';

export type DropMeta = {
  documentId: string;
};

export const drop = (
  state: DocumentCacheState,
  { dest, source, meta }: OnDropParam<DropMeta>,
): DocumentCacheState => {
  const documentId = meta.documentId;
  const document = state.documents[documentId];

  const copiedNode = document.nodes[+source.id];
  const newFatherNode = document.nodes[+dest.id];
  const oldFatherNode = document.nodes[copiedNode.father_id];

  const isSameFather = oldFatherNode.node_id === newFatherNode.node_id;
  const newFatherChildNodes = newFatherNode.child_nodes.slice();
  const oldFatherChildNodes = document.nodes[
    oldFatherNode.node_id
  ].child_nodes.slice();

  const newIndex = dest.index;
  const currentIndex = oldFatherChildNodes.indexOf(copiedNode.node_id);
  if (isSameFather) {
    if (newIndex === currentIndex) return state;
    newFatherChildNodes.splice(currentIndex, 1);
    newFatherChildNodes.splice(newIndex, 0, copiedNode.node_id);
    state = mutateNodeMeta(state, [
      {
        node_id: newFatherNode.node_id,
        documentId: documentId,
        data: {
          child_nodes: newFatherChildNodes,
        },
      },
    ]);
  } else {
    const fathersOfNewFather = getParentsNode_ids({
      nodes: document.nodes,
      node_id: newFatherNode.node_id,
    });

    if (fathersOfNewFather.includes(copiedNode.node_id)) return state;

    newFatherChildNodes.splice(newIndex, 0, copiedNode.node_id);
    moveNode(state, { copiedNode, newFatherNode, oldFatherNode, newIndex });
  }

  return state;
};
