import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql-adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeMetaIt } from '::types/graphql/generated';
import { updateDocumentId } from '::app/editor/document/hooks/save-document/helpers/shared';
import { collectDanglingNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import { EDIT_NODE_META } from '::graphql/mutations/document/edit-node-meta';
import { unFlatMap } from '::helpers/array-helpers';

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

  const nodeMetaIts: NodeMetaIt[] = [];
  for await (const [nodeId, editedAttributes] of editedNodeMeta) {
    const node = apolloCache.node.get(swapNodeIdIfApplies(state)(nodeId));
    const meta: NodeMetaIt = {
      updatedAt: node.updatedAt,
      node_id: node.node_id,
    };
    editedAttributes.forEach(attribute => {
      meta[attribute] = node[attribute];
    });
    swapFatherIdIfApplies(state)(node);
    if (collectDanglingNodes(state)(node)) continue;
    updateDocumentId(state)(node);
    nodeMetaIts.push(meta);
  }
  for await (const chunk of unFlatMap(200)<NodeMetaIt>()(nodeMetaIts)) {
    await apolloCache.client.mutate(
      EDIT_NODE_META({
        file_id: state.swappedDocumentIds[documentId] || documentId,
        meta: chunk,
      }),
    );
  }
};

export { saveNodesMeta, swapNodeIdIfApplies, swapFatherIdIfApplies };
