import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { calcRecentNodes } from '::store/ducks/helpers/document';
import { listNodeEditedAttributes } from '::store/ducks/cache/document-cache/helpers/node/mutate-node-meta';
import { getDefaultHighestNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-highest-node_id';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

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
  const node = document.nodes[node_id];
  if (mode !== 'soft') delete document.nodes[node_id];

  const fatherNode = document.nodes[node.father_id];
  fatherNode.child_nodes = fatherNode.child_nodes.filter(
    node_id => node.node_id !== node_id,
  );

  listNodeEditedAttributes({
    document,
    node_id: fatherNode.node_id,
    attributes: ['child_nodes'],
  });
  document.localState.editedNodes.deleted.push(node_id);
  if (document.localState.highestNode_id === node_id)
    document.localState.highestNode_id = getDefaultHighestNode_id(
      document.nodes,
    );
  document.persistedState.recentNodes = calcRecentNodes({
    nodes: document.nodes,
    recentNodes: state[documentId].persistedState.recentNodes,
    node_id,
  });
  document.persistedState.selectedNode_id =
    fatherNode.node_id || getDefaultSelectedNode_id(document.nodes);
  document.localState.updatedAt = Date.now();
  document.persistedState.localUpdatedAt = Date.now();
  return state;
};
