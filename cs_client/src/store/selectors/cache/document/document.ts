import { store, Store } from '::store/store';
import { createSelector } from 'reselect';

const _getDocuments = (state: Store) => state.documentCache;
const _getDocumentId = (state: Store) => state.document.documentId;
export const getDocumentsList = (state: Store) =>
  Object.values(state.documentCache);

export const getDocuments = createSelector(_getDocuments, documents => {
  return documents;
});
export const getEditedDocuments = () =>
  getDocumentsList(store.getState()).filter(
    document => document.updatedAt < document.state.localUpdatedAt,
  );
export const getDocumentUserId = createSelector(
  _getDocuments,
  _getDocumentId,
  (documents, documentId) => {
    return documents[documentId]?.userId;
  },
);

export const getCurrentDocument = createSelector(
  _getDocuments,
  _getDocumentId,
  (documents, documentId) => {
    return documents[documentId];
  },
);
export const getDocumentHasUnsavedChanges = createSelector(
  getCurrentDocument,
  document => {
    if (document) {
      return document.state.localUpdatedAt > document.updatedAt;
    }
  },
);

