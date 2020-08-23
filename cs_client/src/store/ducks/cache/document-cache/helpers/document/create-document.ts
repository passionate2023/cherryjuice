import {
  CachedDocument,
  DocumentCacheState,
} from '::store/ducks/cache/document-cache';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';

export type CreateDocumentParams = Omit<CachedDocument, 'state'>;

export const createDocument = (
  state: DocumentCacheState,
  document: CreateDocumentParams,
): DocumentCacheState => ({
  ...state,
  [document.id]: {
    ...document,
    state: {
      ...getDefaultState({ newDocument: true }),
    },
  },
});
