import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { mergeDocument } from '::store/ducks/cache/document-cache/helpers/document/shared/merge-document';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';

export const loadDocument = (
  state: DocumentCacheState,
  document: QDocumentMeta,
  next?: SelectNodeParams,
): DocumentCacheState => {
  return {
    ...state,
    [document.id]: mergeDocument(document, state[document.id], next),
  };
};
