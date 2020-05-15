import { NodeMetaPopup } from '::app/reducer';
import { createNode } from '::app/menus/node-meta/helpers/create-node';
import { apolloCache } from '::graphql/cache-helpers';

const getNode = ({ showDialog, documentId, highest_node_id, nodeId }) => {
  let node;
  const newNode =
    showDialog === NodeMetaPopup.CREATE_SIBLING ||
    showDialog === NodeMetaPopup.CREATE_CHILD;
  if (newNode) {
    const _selectedNode = apolloCache.getNode(nodeId);
    const selectedNodeIsASibling =
      showDialog === NodeMetaPopup.CREATE_SIBLING &&
      _selectedNode.father_id !== -1;
    node = createNode({
      documentId,
      highest_node_id,
      fatherId: selectedNodeIsASibling
        ? _selectedNode.fatherId
        : _selectedNode.id,
      father_id: selectedNodeIsASibling
        ? _selectedNode.father_id
        : _selectedNode.node_id,
      previous_sibling_node_id: selectedNodeIsASibling
        ? _selectedNode.node_id
        : -1,
    });
  } else {
    node = apolloCache.getNode(nodeId);
    if (node) {
      // if (node.icon_id === '0') node.icon_id = '1';
    }
  }
  return { node, isNewNode: newNode };
};

export { getNode };
