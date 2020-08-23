import { calcRecentNodes } from '::store/ducks/helpers/document';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';
import { getDefaultHighestNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-highest-node_id';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';

export type ClearSelectedNodeParams = {
  documentId: string;
  removeChildren?: boolean;
};

export const clearSelectedNode = (
  state: DocumentCacheState,
  { documentId, removeChildren }: ClearSelectedNodeParams,
): DocumentCacheState => {
  const nodes = state[documentId].nodes;
  return {
    ...state,
    [documentId]: {
      ...state[documentId],
      state: {
        ...state[documentId].state,
        recentNodes: calcRecentNodes({
          nodes: nodes,
          recentNodes: state[documentId].state.recentNodes,
          removeChildren,
          selectedNode_id: state[documentId].state.selectedNode_id,
        }),
        selectedNode_id: getDefaultSelectedNode_id(nodes),
        highestNode_id: getDefaultHighestNode_id(nodes),
      },
    },
  };
};
