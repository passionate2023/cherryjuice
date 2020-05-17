import { NodeMetaPopup } from '::app/reducer';
import { createNode } from '::app/menus/node-meta/helpers/create-node';
import { apolloCache } from '::graphql/cache/apollo-cache';

const getNode = ({ showDialog, documentId, highest_node_id, nodeId }) => {
  let node, previous_sibling_node_id;
  const newNode =
    showDialog === NodeMetaPopup.CREATE_SIBLING ||
    showDialog === NodeMetaPopup.CREATE_CHILD;
  if (newNode) {
    const _selectedNode = apolloCache.node.get(nodeId);
    const selectedNodeIsASibling =
      showDialog === NodeMetaPopup.CREATE_SIBLING &&
      _selectedNode.father_id !== -1;
    (previous_sibling_node_id = selectedNodeIsASibling
      ? _selectedNode.node_id
      : -1),
      (node = createNode({
        documentId,
        highest_node_id,
        fatherId: selectedNodeIsASibling
          ? _selectedNode.fatherId
          : _selectedNode.id,
        father_id: selectedNodeIsASibling
          ? _selectedNode.father_id
          : _selectedNode.node_id,
      }));
  } else {
    node = apolloCache.node.get(nodeId);
  }
  return {
    node,
    isNewNode: newNode,
    previous_sibling_node_id,
  };
};

export { getNode };
