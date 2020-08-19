import { createNode } from '::root/components/app/components/menus/dialogs/node-meta/helpers/create-node';
import { NodeMetaDialogRole } from '::store/ducks/dialogs';
import { getNode as getNodeSelector } from '::store/selectors/cache/document/node';
import { CachedDocument } from '::store/ducks/cache/document-cache';

type GetNodeProps = {
  document: CachedDocument;
  showDialog: NodeMetaDialogRole;
  node_id: number;
};
const getNode = ({ document, showDialog, node_id }: GetNodeProps) => {
  let node, previous_sibling_node_id;
  const newNode =
    showDialog === 'create-sibling' || showDialog === 'create-child';
  const documentId = document?.id;
  if (newNode) {
    // const _selectedNode = apolloCache.node.get(nodeId);
    const focusedNode = getNodeSelector({ node_id, documentId: documentId });
    const selectedNodeIsASibling =
      showDialog === 'create-sibling' && focusedNode.father_id !== -1;
    (previous_sibling_node_id = selectedNodeIsASibling
      ? focusedNode.node_id
      : -1),
      (node = createNode({
        documentId: documentId,
        highestNode_id: Math.max(
          ...Object.keys(document.nodes).map(key => +key),
        ),
        fatherId: selectedNodeIsASibling
          ? focusedNode.fatherId
          : focusedNode.id,
        father_id: selectedNodeIsASibling
          ? focusedNode.father_id
          : focusedNode.node_id,
      }));
  } else {
    // node = apolloCache.node.get(nodeId);
    node = getNodeSelector({ node_id, documentId: documentId });
  }
  return {
    node,
    isNewNode: newNode,
    previous_sibling_node_id,
  };
};

export { getNode };
