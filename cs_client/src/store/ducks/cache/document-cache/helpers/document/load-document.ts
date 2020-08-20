import { constructTree } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';

export const loadDocument = (
  state: DocumentCacheState,
  payload: QDocumentMeta,
): DocumentCacheState => {
  const nodes = constructTree({
    nodes: payload.node,
    privateNodes: payload.privateNodes,
  });

  const existingState = state[payload.id]?.state;

  const document = {
    ...payload,
    nodes,
    state: getDefaultState({
      existingState,
      nodes,
    }),
  };
  delete document.node;
  return {
    ...state,
    [payload.id]: document,
  };
};
