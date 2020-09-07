import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

export type SelectNodeParams = {
  documentId: string;
  node_id: number;
  hash?: string;
};

export const selectNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state[documentId];
  if (!document?.nodes[node_id] && document.nodes && document.nodes[0])
    node_id = getDefaultSelectedNode_id(document.nodes);
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
