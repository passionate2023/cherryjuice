import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { performMutation } from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';

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
  danglingNodes: {
    [nodeId: string]: boolean;
  };
  deletedNodes: {
    [nodeId: string]: boolean;
  };
};
type SaveOperationProps = {
  mutate: Function;
  state: SaveOperationState;
};

const deleteNode = mutate => async (node: NodeCached) => {
  if (!node.id.startsWith('TEMP:'))
    await performMutation({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
      },
      mutate,
    });
  apolloCache.node.delete.hard(node.id);
};

const saveDeletedNodes = async ({ mutate, state }: SaveOperationProps) => {
  const deletedNodes = apolloCache.changes.node.deleted;

  for (const nodeId of deletedNodes) {
    const node: NodeCached = apolloCache.node.get(nodeId);
    await deleteNode(mutate)(node);
    apolloCache.changes.unsetModificationFlag(
      localChanges.NODE_DELETED,
      nodeId,
    );
    state.deletedNodes[nodeId] = true;
  }
};

const deleteDanglingNodes = async ({ mutate, state }: SaveOperationProps) => {
  const deletedNodes = Object.keys(state.danglingNodes);
  for (const nodeId of deletedNodes) {
    const node: NodeCached = apolloCache.node.get(nodeId);
    await deleteNode(mutate)(node);
  }
};

export { saveDeletedNodes, deleteDanglingNodes };
export { SaveOperationProps, SaveOperationState };
