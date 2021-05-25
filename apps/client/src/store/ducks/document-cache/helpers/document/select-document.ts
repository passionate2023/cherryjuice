import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';

export const selectDocument = (
  state: DocumentCacheState,
  documentId: string,
): DocumentCacheState => {
  const document = state.documents[documentId];
  if (document) {
    document.persistedState.localLastOpenedAt = Date.now();
  }
  return state;
};
