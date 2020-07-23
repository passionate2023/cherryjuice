import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeMetaIt } from '::types/graphql/generated';
import { updateDocumentId } from '::app/editor/document/hooks/save-document/helpers/shared';
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

const saveNodesMeta = async ({ state, documentId }: SaveOperationProps) => {
  const editedNodeMeta = apolloCache.changes
    .document(documentId)
    .node.meta.filter(([id]): boolean => !state.deletedNodes[id]);

  for await (let [nodeId, editedAttributes] of editedNodeMeta) {
    const node = apolloCache.node.get(swapNodeIdIfApplies(state)(nodeId));
    const meta: NodeMetaIt = { updatedAt: node.updatedAt };
    editedAttributes.forEach(attribute => {
      meta[attribute] = node[attribute];
    });
    if (meta.owner && '__typename' in meta.owner)
      delete meta.owner['__typename'];
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
  }
};

export { saveNodesMeta, swapNodeIdIfApplies, swapFatherIdIfApplies };
