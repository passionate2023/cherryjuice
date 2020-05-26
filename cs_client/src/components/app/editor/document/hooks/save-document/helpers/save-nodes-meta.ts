import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeMetaIt } from '::types/graphql/generated';
import { updateDocumentId } from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';
import { collectDanglingNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

const swapNodeIdIfApplies = (state: SaveOperationState) => (nodeId: string) =>
  state.swappedNodeIds[nodeId] ? state.swappedNodeIds[nodeId] : nodeId;
const swapFatherIdIfApplies = (state: SaveOperationState) => (
  node: NodeCached,
) => {
  if (state.newFatherIds[node.node_id]) {
    node.fatherId = state.newFatherIds[node.node_id];
  }
};

const saveNodesMeta = async ({ state }: SaveOperationProps) => {
  const editedNodeMeta = apolloCache.changes.node.meta.filter(
    ([id]): boolean => !state.deletedNodes[id],
  );

  for await (let [nodeId, editedAttributes] of editedNodeMeta) {
    const node = apolloCache.node.get(swapNodeIdIfApplies(state)(nodeId));
    const meta: NodeMetaIt = {};
    editedAttributes.forEach(attribute => {
      meta[attribute] = node[attribute];
    });
    swapFatherIdIfApplies(state)(node);
    if (collectDanglingNodes(state)(node)) continue;
    updateDocumentId(state)(node);
    await apolloCache.client.mutate({
      ...DOCUMENT_MUTATION.meta,
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        meta,
      },
    });
    apolloCache.changes.unsetModificationFlag(localChanges.NODE_META, nodeId);
  }
};

export { saveNodesMeta, swapNodeIdIfApplies, swapFatherIdIfApplies };
