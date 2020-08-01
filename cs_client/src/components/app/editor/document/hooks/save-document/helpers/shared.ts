import { SaveOperationState } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql-adapters';

const updateDocumentId = (state: SaveOperationState) => (node: NodeCached) => {
  if (state.swappedDocumentIds[node.documentId])
    node.documentId = state.swappedDocumentIds[node.documentId];
};

export { updateDocumentId };
