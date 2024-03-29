import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { mergeDocument } from '::store/ducks/document-cache/helpers/document/shared/merge-document';
import { SelectNodeParams } from '::store/ducks/document-cache/helpers/document/select-node';

export const loadDocument = (
  state: DocumentCacheState,
  document: QDocumentMeta,
  next?: SelectNodeParams,
): DocumentCacheState => {
  state.documents[document.id] = mergeDocument(
    document,
    state.documents[document.id],
    next,
  );
  return state;
};
