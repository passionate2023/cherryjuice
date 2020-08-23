import { apolloClient } from '::graphql/client/apollo-client';
import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { CreateNodeIt } from '::types/graphql/generated';
import { updateDocumentId } from '::store/epics/save-documents/helpers/save-document/helpers/shared';
import { swapFatherIdIfApplies } from '::store/epics/save-documents/helpers/save-document/helpers/save-nodes-meta';
import { CREATE_NODE } from '::graphql/mutations/document/create-node';
import { QFullNode } from '::store/ducks/cache/document-cache';

const adapt = ({
  child_nodes,
  createdAt,
  father_id,
  name,
  node_id,
  node_title_styles,
  updatedAt,
  fatherId,
  privacy,
}: QFullNode): CreateNodeIt => ({
  child_nodes,
  createdAt,
  father_id,
  name,
  node_id,
  node_title_styles,
  read_only: 1,
  updatedAt,
  fatherId,
  privacy,
});

const saveNewNodes = async ({ state, document }: SaveOperationProps) => {
  const newNodes = document.state.editedNodes.created
    .filter(node_id => !state.deletedNodes[document.id][node_id])
    .map(node_id => document.nodes[node_id])
    .sort((a, b) => a.node_id - b.node_id);
  for await (const node of newNodes) {
    swapFatherIdIfApplies(state)(node);
    updateDocumentId(state)(node);
    const meta: CreateNodeIt = adapt(node);
    const permanentNodeId = await apolloClient.mutate(
      CREATE_NODE({
        file_id: node.documentId,
        node_id: node.node_id,
        meta,
      }),
    );
    const temporaryId = node.id;
    if (permanentNodeId) {
      state.swappedNodeIds[temporaryId] = permanentNodeId;
    } else {
      throw new Error('could not save node ' + node.id);
    }
  }
};
export { saveNewNodes };