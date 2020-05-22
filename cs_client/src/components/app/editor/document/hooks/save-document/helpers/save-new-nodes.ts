import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { CreateNodeIt } from '::types/graphql/generated';
import {
  performMutation,
  updateDocumentId,
} from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';
import { swapFatherIdIfApplies } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';

const adapt = ({
  child_nodes,
  createdAt,
  documentId,
  father_id,
  icon_id,
  name,
  node_id,
  node_title_styles,
  read_only,
  updatedAt,
  fatherId,
}: NodeCached): CreateNodeIt => ({
  child_nodes,
  createdAt,
  documentId,
  father_id,
  icon_id,
  name,
  node_id,
  node_title_styles,
  read_only,
  updatedAt,
  fatherId,
});

const collectDanglingNodes = (state: SaveOperationState) => (
  node: NodeCached,
): boolean => {
  let dangling = false;
  if (state.deletedNodes[node.fatherId]) {
    state.danglingNodes[node.id] = true;
    dangling = true;
  }
  return dangling;
};

const saveNewNodes = async ({ mutate, state }: SaveOperationProps) => {
  const newNodes = apolloCache.changes.node.created
    .filter(id => !state.deletedNodes[id])
    .map(id => apolloCache.node.get(id))
    .sort((a, b) => a.node_id - b.node_id);
  for await (const node of newNodes) {
    swapFatherIdIfApplies(state)(node);
    if (collectDanglingNodes(state)(node)) continue;
    updateDocumentId(state)(node);
    const meta: CreateNodeIt = adapt(node);
    const data = await performMutation({
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        meta,
      },
      mutate,
    });
    const permanentNodeId = DOCUMENT_MUTATION.createNode.path(data);
    const temporaryId = node.id;
    if (permanentNodeId) {
      apolloCache.node.swapId({ oldId: node.id, newId: permanentNodeId });
      state.swappedNodeIds[temporaryId] = permanentNodeId;
      node.child_nodes.forEach(node_id => {
        state.newFatherIds[node_id] = permanentNodeId;
      });
    } else {
      throw new Error('could not save node ' + node.id);
    }
    apolloCache.changes.unsetModificationFlag(
      localChanges.NODE_CREATED,
      temporaryId,
    );
  }
};
export { saveNewNodes, collectDanglingNodes };
