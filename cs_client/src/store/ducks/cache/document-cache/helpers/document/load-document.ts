import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { mergeDocument } from '::store/ducks/cache/document-cache/helpers/document/shared/merge-document';

export const loadDocument = (
  state: DocumentCacheState,
  payload: QDocumentMeta,
): DocumentCacheState => {
  return {
    ...state,
    [payload.id]: mergeDocument(state[payload.id], payload),
  };
};
