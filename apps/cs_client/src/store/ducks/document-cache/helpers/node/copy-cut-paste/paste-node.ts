import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { createCloneNode } from '::store/ducks/document-cache/helpers/node/copy-cut-paste/paste-node/helpers/create-clone-node';
import { insertCloneNode } from '::store/ducks/document-cache/helpers/node/copy-cut-paste/paste-node/helpers/insert-clone-node';
import { drop } from '::store/ducks/document-cache/helpers/node/drop/drop';

export type PasteNodeParams = {
  documentId: string;
  new_father_id: number;
};

export const pasteNode = (
  state: DocumentCacheState,
  { documentId, new_father_id }: PasteNodeParams,
): DocumentCacheState => {
  const sourceDocument = state.documents[state.copiedNode.documentId];
  const sourceNodes = sourceDocument.nodes;
  const targetDocument = state.documents[documentId];
  const targetNodes = targetDocument.nodes;

  const copiedNode = sourceNodes[state.copiedNode.node_id];
  const newFatherNode = targetNodes[new_father_id];

  if (state.copiedNode.mode === 'copy') {
    const new_node_id = targetDocument.localState.highestNode_id + 1;
    const clone = createCloneNode({
      new_node_id,
      newDocumentId: targetDocument.id,
      newFatherNode_id: newFatherNode.node_id,
      newFatherNodeId: newFatherNode.id,
      copiedNode,
    });
    insertCloneNode(state, { clone, copiedNode });
  } else if (state.copiedNode.mode === 'cut') {
    drop(state, {
      source: { id: copiedNode.node_id + '', index: -1 },
      dest: {
        id: newFatherNode.node_id + '',
        index: newFatherNode.child_nodes.length,
      },
      meta: { documentId: newFatherNode.documentId },
    });
  }

  state.copiedNode = undefined;
  return state;
};
