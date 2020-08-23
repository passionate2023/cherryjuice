import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/cache/document-cache';
export type CreateNodeParams = QFullNode;
export const createNode = (
  state: DocumentCacheState,
  node: CreateNodeParams,
): DocumentCacheState => {
  const document = state[node.documentId];
  const documentState = document.state;
  return {
    ...state,
    [node.documentId]: {
      ...document,
      nodes: {
        ...document.nodes,
        [node.node_id]: node,
      },
      state: {
        ...documentState,
        localUpdatedAt: Date.now(),
        highestNode_id: node.node_id,
        editedNodes: {
          ...documentState.editedNodes,
          created: [...documentState.editedNodes.created, node.node_id],
        },
      },
    },
  };
};
