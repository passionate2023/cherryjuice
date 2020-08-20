import { CachedDocument } from '::store/ducks/cache/document-cache';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';
import { constructTree } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { QDocumentMeta } from '::graphql/queries/document-meta';

export const mergeDocument = (
  existingDocument: CachedDocument,
  newDocument: QDocumentMeta,
): CachedDocument => {
  const nodes = constructTree({
    nodes: newDocument.node,
    privateNodes: newDocument.privateNodes,
  });

  const existingState = existingDocument?.state;
  const existingNodesDict = existingDocument?.nodes;

  const existingWasInDocsListOnly = existingNodesDict && !existingNodesDict[0];
  const existingDocHasChanges =
    existingState && existingState.localUpdatedAt > existingDocument.updatedAt;
  if (existingWasInDocsListOnly && existingDocHasChanges) {
    return {
      ...existingDocument,
      nodes,
    };
  } else {
    const document = {
      ...newDocument,
      nodes,
      state: getDefaultState({
        existingState,
        nodes,
      }),
    };
    delete document.node;
    return document;
  }
};
