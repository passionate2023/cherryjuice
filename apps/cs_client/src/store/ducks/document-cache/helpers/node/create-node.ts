import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { listNodeEditedAttributes } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { expandNode } from '::store/ducks/document-cache/helpers/node/expand-node/expand-node';

export type CreateNodeParams = {
  createdNode: QFullNode;
  previous_sibling_node_id: number;
};

export const createNode = (
  state: DocumentCacheState,
  { createdNode: node, previous_sibling_node_id }: CreateNodeParams,
): DocumentCacheState => {
  const document = state.documents[node.documentId];
  document.nodes[node.node_id] = node;

  const fatherNode = document.nodes[node.father_id];
  const position =
    previous_sibling_node_id === -1
      ? -1
      : fatherNode.child_nodes.indexOf(previous_sibling_node_id) + 1;
  if (!fatherNode.child_nodes.includes(node.node_id))
    position === -1
      ? fatherNode.child_nodes.push(node.node_id)
      : fatherNode.child_nodes.splice(position, 0, node.node_id);

  document.localState.editedNodes.created.push(node.node_id);
  listNodeEditedAttributes({
    document,
    node_id: node.father_id,
    attributes: ['child_nodes'],
  });
  document.persistedState.selectedNode_id = node.node_id;
  document.persistedState.localUpdatedAt = Date.now();
  document.localState.localUpdatedAt = Date.now();
  document.localState.highestNode_id = node.node_id;
  expandNode(
    { documents: { [document.id]: document } },
    {
      node_id: document.persistedState.selectedNode_id,
      documentId: document.id,
      expandChildren: true,
    },
  );
  return state;
};
