import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import {
  SaveOperationProps,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { CreateNodeIt } from '::types/graphql/generated';
import { updateDocumentId } from '::app/editor/document/hooks/save-document/helpers/shared';
import { swapFatherIdIfApplies } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';

const adapt = ({
  child_nodes,
  createdAt,
  documentId,
  father_id,
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

const saveNewNodes = async ({ state, documentId }: SaveOperationProps) => {
  const newNodes = apolloCache.changes
    .document(documentId)
    .node.created.filter(id => !state.deletedNodes[id])
    .map(id => apolloCache.node.get(id))
    .sort((a, b) => a.node_id - b.node_id);
  for await (const node of newNodes) {
    swapFatherIdIfApplies(state)(node);
    if (collectDanglingNodes(state)(node)) continue;
    updateDocumentId(state)(node);
    const meta: CreateNodeIt = adapt(node);
    const permanentNodeId = await apolloCache.client.mutate({
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        meta,
      },
      query: DOCUMENT_MUTATION.createNode.query,
      path: DOCUMENT_MUTATION.createNode.path,
    });
    const temporaryId = node.id;
    if (permanentNodeId) {
      apolloCache.node.swapId({
        oldId: node.id,
        newId: permanentNodeId,
        documentId,
      });
      state.swappedNodeIds[temporaryId] = permanentNodeId;
      node.child_nodes.forEach(node_id => {
        state.newFatherIds[node_id] = permanentNodeId;
      });
    } else {
      throw new Error('could not save node ' + node.id);
    }
  }
};
export { saveNewNodes, collectDanglingNodes };
