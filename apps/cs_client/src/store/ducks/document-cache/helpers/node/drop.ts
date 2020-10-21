import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { OnDropParam } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { mutateNodeMeta } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/tree';

export type DropMeta = {
  documentId: string;
};

export const drop = (
  state: DocumentCacheState,
  { dest, source, meta }: OnDropParam<DropMeta>,
): DocumentCacheState => {
  const documentId = meta.documentId;
  const document = state.documents[documentId];

  const node = document.nodes[+source.id];
  const target = document.nodes[+dest.id];

  const newFather_id = target.node_id;
  const newFatherId = target.id;
  const oldFather_id = node.father_id;
  const sameFather = oldFather_id === newFather_id;
  const newFatherChildNodes = target.child_nodes.slice();
  const oldFatherChildNodes = document.nodes[oldFather_id].child_nodes.slice();
  const droppedNode_id = node.node_id;

  const newIndex = dest.index;
  const currentIndex = oldFatherChildNodes.indexOf(droppedNode_id);
  if (sameFather) {
    if (newIndex === currentIndex) return state;
    newFatherChildNodes.splice(currentIndex, 1);
    newFatherChildNodes.splice(newIndex, 0, droppedNode_id);
    state = mutateNodeMeta(state, [
      {
        node_id: newFather_id,
        documentId: documentId,
        data: {
          child_nodes: newFatherChildNodes,
        },
      },
    ]);
  } else {
    const fathersOfNewFather = getParentsNode_ids(
      undefined,
      document.nodes,
      newFather_id,
    );

    if (fathersOfNewFather.includes(droppedNode_id)) return state;

    newFatherChildNodes.splice(newIndex, 0, droppedNode_id);
    state = mutateNodeMeta(state, [
      {
        node_id: droppedNode_id,
        documentId: documentId,
        data: {
          father_id: newFather_id,
          fatherId: newFatherId,
        },
      },
      {
        node_id: oldFather_id,
        documentId: documentId,
        data: {
          child_nodes: oldFatherChildNodes.filter(
            node_id => node_id !== droppedNode_id,
          ),
        },
      },
      {
        node_id: newFather_id,
        documentId: documentId,
        data: {
          child_nodes: newFatherChildNodes,
        },
      },
    ]);
  }

  return state;
};
