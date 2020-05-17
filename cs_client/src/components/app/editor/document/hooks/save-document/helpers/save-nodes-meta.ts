import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeMetaIt } from '::types/graphql/generated';
import {
  performMutation,
  updateDocumentId,
} from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';
import { collectDanglingNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';

const swapNodeIdIfApplies = (state: SaveOperationState) => (nodeId: string) =>
  state.swappedNodeIds[nodeId] ? state.swappedNodeIds[nodeId] : nodeId;
const swapFatherIdIfApplies = (state: SaveOperationState) => (
  node: NodeCached,
) => {
  if (state.newFatherIds[node.node_id]) {
    node.fatherId = state.newFatherIds[node.node_id];
  }
};

const saveNodesMeta = async ({ mutate, state }: SaveOperationProps) => {
  const editedNodeMeta = apolloCache.changes.node.meta.filter(
    ([id]): boolean => !state.deletedNodes[id],
  );
  for (let [nodeId, editedAttributes] of editedNodeMeta) {
    nodeId = swapNodeIdIfApplies(state)(nodeId);
    const node = apolloCache.node.get(nodeId);
    const meta: NodeMetaIt = {};
    editedAttributes.forEach(attribute => {
      meta[attribute] = node[attribute];
    });
    swapFatherIdIfApplies(state)(node);
    if (collectDanglingNodes(state)(node)) continue;
    updateDocumentId(state)(node);
    await performMutation({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
        meta,
      },
      mutate,
    });
    apolloCache.changes.unsetModificationFlag(localChanges.NODE_META, node.id);
  }
};

export { saveNodesMeta, swapNodeIdIfApplies, swapFatherIdIfApplies };
