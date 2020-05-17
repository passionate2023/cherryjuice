import { useCallback } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeCached } from '::types/graphql/adapters';
import { appActionCreators } from '::app/reducer';
import { useHistory } from 'react-router-dom';

const updateFatherNode = (deletedNode: NodeCached) => {
  const fatherNode = apolloCache.node.get(deletedNode.fatherId);
  const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
    deletedNode.node_id,
  );
  fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
  return fatherNode;
};

const useDeleteNode = (nodeId: string, node: NodeCached) => {
  const history = useHistory();
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
    appActionCreators.removeNodeFromRecentNodes(nodeId);
    const nodePath = `/document/${node.documentId}/`;
    history.push(nodePath);
  }, [nodeId]);
};

export { useDeleteNode, updateFatherNode };
