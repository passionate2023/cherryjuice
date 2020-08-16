import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql-adapters';

const updateDocumentId = (state: SaveOperationState) => (node: NodeCached) => {
  if (state.swappedDocumentIds[node.documentId])
    node.documentId = state.swappedDocumentIds[node.documentId];
};

const createSaveState = (): SaveOperationState => ({
  newFatherIds: {},
  swappedDocumentIds: {},
  swappedNodeIds: {},
  swappedImageIds: {},
  danglingNodes: {},
  deletedNodes: {},
});

export { updateDocumentId, createSaveState };
