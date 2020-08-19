import { DocumentCacheState } from '::store/ducks/cache/document-cache';

export type DeleteNodeParams = {
  node_id: number;
  documentId: string;
  mode?: 'soft';
};
export const deleteNode = (
  state: DocumentCacheState,
  { node_id, documentId, mode }: DeleteNodeParams,
): DocumentCacheState => {
  const document = state[documentId];
  if (mode !== 'soft') delete document.nodes[node_id];
  return {
    ...state,
    [documentId]: {
      ...document,
      nodes: {
        ...document.nodes,
      },
      state: {
        ...document.state,
        localUpdatedAt: Date.now(),
        editedNodes: {
          ...document.state.editedNodes,
          deleted: [...document.state.editedNodes.deleted, node_id],
        },
      },
    },
  };
};
