import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { localChanges } from '::graphql/cache/helpers/changes';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

type SaveOperationState = {
  newFatherIds: {
    [node_id: string]: string;
  };
  swappedDocumentIds: {
    [temporaryId: string]: string;
  };
  swappedNodeIds: {
    [temporaryId: string]: string;
  };
  swappedImageIds: {
    [temporaryId: string]: string;
  };
  danglingNodes: {
    [nodeId: string]: boolean;
  };
  deletedNodes: {
    [nodeId: string]: boolean;
  };
};
type SaveOperationProps = {
  state: SaveOperationState;
};

const deleteNode = async (node: NodeCached) => {
  if (!node.id.startsWith('TEMP:'))
    await apolloCache.client.mutate({
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
      },
      query: DOCUMENT_MUTATION.deleteNode.query,
      path: DOCUMENT_MUTATION.deleteNode.path,
    });
  apolloCache.node.delete.hard(node.id);
};

const saveDeletedNodes = async ({ state }: SaveOperationProps) => {
  const deletedNodes = apolloCache.changes.node.deleted;

  for await (const nodeId of deletedNodes) {
    const node: NodeCached = apolloCache.node.get(nodeId);
    await deleteNode(node);
    apolloCache.changes.unsetModificationFlag(
      localChanges.NODE_DELETED,
      nodeId,
    );
    state.deletedNodes[nodeId] = true;
  }
};

const deleteDanglingNodes = async ({ state }: SaveOperationProps) => {
  const deletedNodes = Object.keys(state.danglingNodes);
  for await (const nodeId of deletedNodes) {
    const node: NodeCached = apolloCache.node.get(nodeId);
    await deleteNode(node);
  }
};

export { saveDeletedNodes, deleteDanglingNodes };
export { SaveOperationProps, SaveOperationState };
