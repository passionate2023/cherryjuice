import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';

export const pinDocument = (
  state: DocumentCacheState,
  documentId: string,
): DocumentCacheState => {
  const document = state.documents[documentId];
  if (document) {
    document.persistedState.pinned = !document.persistedState.pinned;
    document.persistedState.localUpdatedAt = Date.now();
  }
  return state;
};
