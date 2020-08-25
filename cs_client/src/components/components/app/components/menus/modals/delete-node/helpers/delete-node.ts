import { ac } from '::store/store';
import { QFullNode } from '::store/ducks/cache/document-cache';
import { getNode } from '::store/selectors/cache/document/node';

const deleteNode = (deletedNode: QFullNode) => {
  return () => {
    const fatherNode = getNode({
      node_id: deletedNode.father_id,
      documentId: deletedNode.documentId,
    });
    ac.documentCache.mutateNodeMeta({
      node_id: fatherNode.node_id,
      documentId: fatherNode.documentId,
      data: {
        child_nodes: fatherNode.child_nodes.filter(
          node_id => deletedNode.node_id !== node_id,
        ),
      },
    });

    ac.documentCache.deleteNode({
      documentId: deletedNode.documentId,
      node_id: deletedNode.node_id,
      mode: 'soft',
    });
    ac.node.unselect({
      removeChildren: true,
      documentId: deletedNode.documentId,
    });
  };
};

export { deleteNode };
