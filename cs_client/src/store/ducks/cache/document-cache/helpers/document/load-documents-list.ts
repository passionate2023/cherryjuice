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
      if (!fetchedDocuments[documentId] && !documentId.startsWith('new'))
        delete state[documentId];
    });
    return {
      ...fetchedDocuments,
      ...state,
    };
  }
};
