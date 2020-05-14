import { useCallback } from 'react';
import { apolloCache } from '::graphql/cache-helpers';
import { NodeCached } from '::types/graphql/adapters';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { appActionCreators } from '::app/reducer';
import { useHistory } from 'react-router-dom';

const updateFatherNode = (deletedNode: NodeCached, fatherNode: NodeCached) => {
  const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
    deletedNode.node_id,
  );
  fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
  apolloCache.setNode(fatherNode.id, fatherNode);
};

const notifyLocalStore = (deletedNode: NodeCached, fatherNode: NodeCached) => {
  documentActionCreators.setNodeDeleted(deletedNode.id);
  documentActionCreators.setNodeMetaHasChanged(fatherNode.id, ['child_nodes']);
};

const useDeleteNode = (nodeId: string, node: NodeCached) => {
  const history = useHistory();
  return useCallback(() => {
    const fatherNode = apolloCache.getNode(node.fatherId);
    updateFatherNode(node, fatherNode);
    notifyLocalStore(node, fatherNode);
    appActionCreators.toggleDeleteDocumentModal();
    const nodePath = `/document/${fatherNode.documentId}/`;
    history.push(nodePath);
  }, [nodeId]);
};

export { useDeleteNode, updateFatherNode };
