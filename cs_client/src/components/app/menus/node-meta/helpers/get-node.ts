import { createNode } from '::app/menus/node-meta/helpers/create-node';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeMetaDialogRole } from '::root/store/ducks/dialogs';

type GetNodeProps = {
  showDialog: NodeMetaDialogRole;
  documentId;
  highestNode_id;
  nodeId;
};
const getNode = ({
  showDialog,
  documentId,
  highestNode_id,
  nodeId,
}: GetNodeProps) => {
  let node, previous_sibling_node_id;
  const newNode =
    showDialog === 'create-sibling' || showDialog === 'create-child';
  if (newNode) {
    const _selectedNode = apolloCache.node.get(nodeId);
    const selectedNodeIsASibling =
      showDialog === 'create-sibling' && _selectedNode.father_id !== -1;
    (previous_sibling_node_id = selectedNodeIsASibling
      ? _selectedNode.node_id
      : -1),
      (node = createNode({
        documentId,
        highestNode_id,
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
