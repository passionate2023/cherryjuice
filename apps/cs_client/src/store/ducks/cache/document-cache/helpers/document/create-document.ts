import {
  CachedDocument,
  DocumentCacheState,
} from '::store/ducks/cache/document-cache';
import { getDefaultPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-persisted-state';
import { getDefaultLocalState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-local-state';

export type CreateDocumentParams = Omit<CachedDocument, 'state'>;

export const createDocument = (
  state: DocumentCacheState,
  document: CreateDocumentParams,
): DocumentCacheState => ({
  ...state,
  documents: {
    ...state.documents,
    [document.id]: {
      ...document,
      persistedState: getDefaultPersistedState(),
      localState: getDefaultLocalState(document.id, document.nodes),
    },
  },
});
