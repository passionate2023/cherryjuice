import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { QFullNode } from '::store/ducks/cache/document-cache';

const updateDocumentId = (state: SaveOperationState) => (
  node: QFullNode,
): QFullNode => {
  let documentId = node.documentId;
  if (state.swappedDocumentIds[node.documentId])
    documentId = state.swappedDocumentIds[node.documentId];
  return { ...node, documentId };
};

const createSaveState = (): SaveOperationState => ({
  swappedDocumentIds: {},
  swappedNodeIds: {},
  swappedImageIds: {},
  deletedNodes: {},
});

export { updateDocumentId, createSaveState };
