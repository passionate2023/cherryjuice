import { useCallback } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeCached } from '::types/graphql/adapters';
import { appActionCreators } from '::app/reducer';
import { navigate } from '::root/router/navigate';
import { ac } from '::root/store/actions.types';

const updateFatherNode = (deletedNode: NodeCached) => {
  const fatherNode = apolloCache.node.get(deletedNode.fatherId);
  const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
    deletedNode.node_id,
  );
  fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
  return fatherNode;
};

const useDeleteNode = (nodeId: string, node: NodeCached) => {
  return useCallback(() => {
    const fatherNode = updateFatherNode(node);
    apolloCache.node.mutate({
      nodeId: fatherNode.id,
      meta: {
        child_nodes: fatherNode.child_nodes,
      },
    });
    apolloCache.node.delete.soft(node.id);
    appActionCreators.toggleDeleteDocumentModal();
    ac.node.clearSelected();
    navigate.document(node.documentId);
  }, [nodeId]);
};

export { useDeleteNode, updateFatherNode };
