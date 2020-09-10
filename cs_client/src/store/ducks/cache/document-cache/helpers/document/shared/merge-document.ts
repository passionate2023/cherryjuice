import { CachedDocument } from '::store/ducks/cache/document-cache';
import { constructTree } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import { expandNode } from '::store/ducks/cache/document-cache/helpers/node/expand-node/expand-node';
import { getDefaultLocalState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-local-state';
import { adaptFromPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/adapt-persisted-state';
import { pluckProperties } from '::store/ducks/cache/document-cache/helpers/document/shared/pluck-document-meta';

export const mergeDocument = (
  fetchedDocument: QDocumentMeta,
  existingDocument?: CachedDocument,
  nextNode?: SelectNodeParams,
): CachedDocument => {
  const nodes = constructTree({
    nodes: fetchedDocument.node,
    privateNodes: fetchedDocument.privateNodes,
  });

  const existingLocalState = existingDocument?.localState;
  const existingNodesDict = existingDocument?.nodes;

  const existingWasInDocsListOnly =
    !existingNodesDict || (existingNodesDict && !existingNodesDict[0]);
  const existingDocHasChanges =
    existingLocalState &&
    existingLocalState.updatedAt > existingDocument.updatedAt;

  let newCachedDocument: CachedDocument;
  const localState = getDefaultLocalState(fetchedDocument.id, nodes);
  const persistedState = adaptFromPersistedState({
    persistedState: fetchedDocument.state,
    nodes,
  });
  if (existingWasInDocsListOnly && existingDocHasChanges) {
    newCachedDocument = {
      ...pluckProperties(existingDocument),
      nodes,
      localState,
      persistedState,
    };
  } else {
    newCachedDocument = {
      ...pluckProperties(fetchedDocument),
      nodes,
      localState,
      persistedState,
    };
  }
  if (nextNode && newCachedDocument.nodes[nextNode.node_id]) {
    newCachedDocument.persistedState.selectedNode_id = nextNode.node_id;
    newCachedDocument.persistedState.updatedAt = Date.now();
  }
  expandNode(
    { [newCachedDocument.id]: newCachedDocument },
    {
      node_id: newCachedDocument.persistedState.selectedNode_id,
      documentId: newCachedDocument.id,
      expandChildren: false,
    },
  );
  return newCachedDocument;
};
