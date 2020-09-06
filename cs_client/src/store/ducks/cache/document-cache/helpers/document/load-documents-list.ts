import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';
import { DocumentMeta } from '::types/graphql-adapters';

export type LoadDocumentsListPayload = DocumentMeta[];

export const loadDocumentsList = (
  state: DocumentCacheState,
  documents: LoadDocumentsListPayload,
): DocumentCacheState => {
  {
    const fetchedDocuments = Object.fromEntries(
      documents.map(document => [
        document.id,
        {
          ...document,
          nodes: {},
          privateNodes: [],
          state: getDefaultState(),
        },
      ]),
    );
    Object.keys(state).forEach(documentId => {
      const intruder = !fetchedDocuments[documentId];
      const ownedBySameUser =
        fetchedDocuments[documentId]?.userId === state[documentId]?.userId;
      const notNew = !documentId.startsWith('new');
      if (intruder && notNew && ownedBySameUser) delete state[documentId];
    });
    return {
      ...fetchedDocuments,
      ...state,
    };
  }
};
