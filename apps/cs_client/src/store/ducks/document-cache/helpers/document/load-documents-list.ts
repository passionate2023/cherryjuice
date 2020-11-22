import {
  CachedDocumentDict,
  DocumentCacheState,
} from '::store/ducks/document-cache/document-cache';
import { getDefaultPersistedState } from '::store/ducks/document-cache/helpers/document/shared/get-default-persisted-state';
import { getDefaultLocalState } from '::store/ducks/document-cache/helpers/document/shared/get-default-local-state';
import { pluckProperties } from '::store/ducks/document-cache/helpers/document/shared/pluck-document-meta';
import { QDocumentsListItem } from '::graphql/fragments/document-list-item';
export const documentIsNotNew = (documentId: string): boolean =>
  !documentId.startsWith('new');

const deleteObsoleteDocuments = (
  exitingDocuments: CachedDocumentDict,
  fetchedDocuments: CachedDocumentDict,
): void => {
  Object.keys(exitingDocuments).forEach(documentId => {
    const noLongerExists = !fetchedDocuments[documentId];
    const ownedBySameUser =
      fetchedDocuments[documentId]?.userId ===
      exitingDocuments[documentId]?.userId;
    const isNotNew = documentIsNotNew(documentId);
    if (noLongerExists && isNotNew && ownedBySameUser)
      delete exitingDocuments[documentId];
  });
};

const mergeFetchedDocuments = (
  exitingDocuments: CachedDocumentDict,
  fetchedDocuments: CachedDocumentDict,
): void => {
  Object.entries(fetchedDocuments).forEach(([documentId, document]) => {
    const exists = !!exitingDocuments[documentId];
    if (!exists) {
      exitingDocuments[documentId] = document;
    }
  });
};
export type LoadDocumentsListPayload = QDocumentsListItem[];

export const loadDocumentsList = (
  state: DocumentCacheState,
  documents: LoadDocumentsListPayload,
): DocumentCacheState => {
  {
    const fetchedDocuments: CachedDocumentDict = Object.fromEntries(
      documents.filter(Boolean).map(document => [
        document.id,
        {
          ...pluckProperties(document),
          nodes: {},
          privateNodes: [],
          persistedState: getDefaultPersistedState(),
          localState: getDefaultLocalState(document.id, undefined),
        },
      ]),
    );
    deleteObsoleteDocuments(state.documents, fetchedDocuments);
    mergeFetchedDocuments(state.documents, fetchedDocuments);
    return state;
  }
};
