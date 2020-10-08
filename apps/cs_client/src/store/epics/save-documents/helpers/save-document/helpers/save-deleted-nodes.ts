import { apolloClient } from '::graphql/client/apollo-client';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import {
  CachedDocument,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { newNodePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

type SaveOperationState = {
  swappedDocumentIds: {
    [temporaryId: string]: string;
  };
  swappedNodeIds: {
    [temporaryId: string]: string;
  };
  swappedImageIds: {
    [temporaryId: string]: string;
  };

  deletedNodes: {
    [documentId: string]: {
      [node_id: number]: boolean;
    };
  };
  newSelectedDocumentId?: string;
};
type SaveOperationProps = {
  state: SaveOperationState;
  document: CachedDocument;
};

const deleteNode = async (node: QFullNode) => {
  if (!node.id.startsWith(newNodePrefix))
    await apolloClient.mutate({
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
      },
      query: DOCUMENT_MUTATION.deleteNode.query,
      path: DOCUMENT_MUTATION.deleteNode.path,
    });
};

const markAsDeleted = (document: CachedDocument, state: SaveOperationState) => (
  node_id: number,
) => {
  state.deletedNodes[document.id][node_id] = true;
  const node = document.nodes[node_id];
  if (node?.child_nodes)
    node.child_nodes.forEach(markAsDeleted(document, state));
};

const saveDeletedNodes = async ({
  document,
  state,
}: SaveOperationProps): Promise<void> => {
  const deletedNodes = document.localState.editedNodes.deleted;
  for await (const node_id of deletedNodes) {
    const node = document.nodes[node_id];
    await deleteNode(node);
    markAsDeleted(document, state)(node.node_id);
  }
};

export { saveDeletedNodes };
export { SaveOperationProps, SaveOperationState };
