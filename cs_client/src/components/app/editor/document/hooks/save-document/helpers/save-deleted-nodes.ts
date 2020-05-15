import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import {
  documentActionCreators,
  localChanges,
} from '::app/editor/document/reducer/action-creators';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';

const mutateDeleteNode = async ({ nodeId, mutate }: { nodeId; mutate }) =>
  await new Promise((res, rej) => {
    const node: NodeCached = apolloCache.getNode(nodeId);

    mutate({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
      },

      update: () => {
        apolloCache.deleteNode(nodeId);
        res();
      },
    }).catch(rej);
  });
type SaveOperationState = {
  newFatherIds: {
    [node_id: string]: string;
  };
};
type SaveOperationProps = {
  mutate: Function;
  nodes: TEditedNodes;
  state: SaveOperationState;
};
const saveDeletedNodes = async ({ mutate, nodes }: SaveOperationProps) => {
  const deletedNodes = Object.entries(nodes)
    .filter(([, { deleted, new: isNew }]) => deleted && !isNew)
    .map(([nodeId]) => nodeId);
  for (const nodeId of deletedNodes) {
    await mutateDeleteNode({
      nodeId,
      mutate,
    });
    documentActionCreators.clearLocalChanges(nodeId, localChanges.DELETED);
  }
};

export { saveDeletedNodes };
export { SaveOperationProps, SaveOperationState };
