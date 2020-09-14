import {
  CachedDocumentDict,
  DocumentCacheState,
} from '::store/ducks/cache/document-cache';
import { DocumentMeta } from '::types/graphql-adapters';
import { getDefaultPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-persisted-state';
import { getDefaultLocalState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-local-state';
import { pluckProperties } from '::store/ducks/cache/document-cache/helpers/document/shared/pluck-document-meta';

export type LoadDocumentsListPayload = DocumentMeta[];

export const loadDocumentsList = (
  state: DocumentCacheState,
  documents: LoadDocumentsListPayload,
): DocumentCacheState => {
  {
    const fetchedDocuments: CachedDocumentDict = Object.fromEntries(
      documents.map(document => [
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
    Object.keys(state.documents).forEach(documentId => {
      const intruder = !fetchedDocuments[documentId];
      const ownedBySameUser =
        fetchedDocuments[documentId]?.userId ===
        state.documents[documentId]?.userId;
      const notNew = !documentId.startsWith('new');
      if (intruder && notNew && ownedBySameUser)
        delete state.documents[documentId];
    });
    return {
      ...state,
      documents: {
        ...fetchedDocuments,
        ...state.documents,
      },
    };
  }
};
