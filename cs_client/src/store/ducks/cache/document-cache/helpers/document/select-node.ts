import { DocumentCacheState } from '::store/ducks/cache/document-cache';

export type SelectNodeParams = {
  documentId: string;
  node_id: number;
};

export const selectNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state[documentId];
  if (document?.nodes[node_id]) {
    document.state.selectedNode_id = node_id;
    document.state.recentNodes = [
      ...state[documentId].state.recentNodes.filter(
        _node_id => _node_id !== node_id,
      ),
      node_id,
    ];
  }
  return state;
};
