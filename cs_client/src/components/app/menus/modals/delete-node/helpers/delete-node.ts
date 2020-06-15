import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeCached } from '::types/graphql/adapters';
import { appActionCreators } from '::app/reducer';
import { router } from '::root/router/router';
import { ac } from '::root/store/store';

const updateFatherNode = (deletedNode: NodeCached) => {
  const fatherNode = apolloCache.node.get(deletedNode.fatherId);
  const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
    deletedNode.node_id,
  );
  fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
  return fatherNode;
};

const deleteNode = (node: NodeCached) => {
  return () => {
    const fatherNode = updateFatherNode(node);
    apolloCache.node.mutate({
      nodeId: fatherNode.id,
      meta: {
        child_nodes: fatherNode.child_nodes,
      },
    });
    apolloCache.node.delete.soft({
      documentId: node.documentId,
      nodeId: node.id,
    });
    appActionCreators.toggleDeleteDocumentModal();
    ac.document.clearSelectedNode({ removeChildren: true });
    router.document(node.documentId);
  };
};

export { deleteNode, updateFatherNode };
