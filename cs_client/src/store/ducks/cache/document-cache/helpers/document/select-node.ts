import { DocumentCacheState } from '::store/ducks/cache/document-cache';

export type SelectNodeParams = {
  documentId: string;
  node_id: number;
};

export const selectNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  return {
    ...state,
    [documentId]: {
      ...state[documentId],
      state: {
        ...state[documentId].state,
        selectedNode_id: node_id,
        recentNodes: [
          ...state[documentId].state.recentNodes.filter(
            _node_id => _node_id !== node_id,
          ),
          node_id,
        ],
      },
    },
  };
};
