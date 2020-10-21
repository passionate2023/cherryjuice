import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { DocumentStateTuple } from '::store/tasks/sync-persisted-state';

export const neutralizePersistedState = (
  state: DocumentCacheState,
  documents: DocumentStateTuple[],
): DocumentCacheState => {
  documents.forEach(([documentId, persistedState]) => {
    const document = state.documents[documentId];
    const updatedAt = new Date(persistedState.updatedAt).getTime();
    const lastOpenedAt = new Date(persistedState.lastOpenedAt).getTime();
    document.persistedState.updatedAt = updatedAt;
    document.persistedState.localUpdatedAt = updatedAt;
    document.persistedState.lastOpenedAt = lastOpenedAt;
    document.persistedState.localLastOpenedAt = lastOpenedAt;
  });
  return state;
};
