import { ac } from '::store/store';
import { QFullNode } from '::store/ducks/cache/document-cache';
import { getNode } from '::store/selectors/cache/document/node';

const updateFatherNode = (deletedNode: QFullNode) => {
  const fatherNode = getNode({
    node_id: deletedNode.father_id,
    documentId: deletedNode.documentId,
  });
  const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
    deletedNode.node_id,
  );
  fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
  return fatherNode;
};

const deleteNode = (node: QFullNode) => {
  return () => {
    const fatherNode = updateFatherNode(node);
    ac.documentCache.mutateNode({
      node_id: fatherNode.node_id,
      documentId: fatherNode.documentId,
      data: {
        child_nodes: fatherNode.child_nodes,
      },
    });

    ac.documentCache.deleteNode({
      documentId: node.documentId,
      node_id: node.node_id,
      mode: 'soft',
    });
    ac.document.clearSelectedNode({
      removeChildren: true,
      documentId: node.documentId,
    });
  };
};

export { deleteNode, updateFatherNode };
