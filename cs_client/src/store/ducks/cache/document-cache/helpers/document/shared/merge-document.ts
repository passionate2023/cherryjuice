import { CachedDocument } from '::store/ducks/cache/document-cache';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';
import { constructTree } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import { expandNode } from '::store/ducks/cache/document-cache/helpers/node/expand-node/expand-node';

export const mergeDocument = (
  fetchedDocument: QDocumentMeta,
  existingDocument?: CachedDocument,
  nextNode?: SelectNodeParams,
): CachedDocument => {
  const nodes = constructTree({
    nodes: fetchedDocument.node,
    privateNodes: fetchedDocument.privateNodes,
  });

  const existingState = existingDocument?.state;
  const existingNodesDict = existingDocument?.nodes;

  const existingWasInDocsListOnly =
    !existingNodesDict || (existingNodesDict && !existingNodesDict[0]);
  const existingDocHasChanges =
    existingState && existingState.localUpdatedAt > existingDocument.updatedAt;

  let newCachedDocument: CachedDocument;
  if (existingWasInDocsListOnly && existingDocHasChanges) {
    newCachedDocument = {
      userId: existingDocument.userId,
      name: existingDocument.name,
      size: existingDocument.size,
      folder: existingDocument.folder,
      guests: existingDocument.guests,
      hash: existingDocument.hash,
      id: existingDocument.id,
      privacy: existingDocument.privacy,
      privateNodes: existingDocument.privateNodes,
      createdAt: existingDocument.createdAt,
      updatedAt: existingDocument.updatedAt,
      nodes,
      state: existingDocument.state,
    };
  } else {
    newCachedDocument = {
      userId: fetchedDocument.userId,
      name: fetchedDocument.name,
      size: fetchedDocument.size,
      folder: fetchedDocument.folder,
      guests: fetchedDocument.guests,
      hash: fetchedDocument.hash,
      id: fetchedDocument.id,
      privacy: fetchedDocument.privacy,
      privateNodes: fetchedDocument.privateNodes,
      createdAt: fetchedDocument.createdAt,
      updatedAt: fetchedDocument.updatedAt,
      nodes,
      state: getDefaultState({
        existingState,
        nodes,
      }),
    };
  }
  if (nextNode && newCachedDocument.nodes[nextNode.node_id]) {
    newCachedDocument.state.selectedNode_id = nextNode.node_id;
  }
  const fatherOfSelectedNode =
    newCachedDocument.nodes[newCachedDocument.state.selectedNode_id];
  expandNode(
    { [newCachedDocument.id]: newCachedDocument },
    {
      node_id: fatherOfSelectedNode.father_id,
      documentId: newCachedDocument.id,
    },
  );
  return newCachedDocument;
};
