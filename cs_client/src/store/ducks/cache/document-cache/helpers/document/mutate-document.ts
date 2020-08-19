import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { removeDuplicates } from '::helpers/array-helpers';

type DocumentMeta = {
  name?: string;
};
export type MutateDocumentProps = {
  documentId: string;
  meta: DocumentMeta;
};

export const mutateDocument = (
  state: DocumentCacheState,
  payload: MutateDocumentProps,
): DocumentCacheState => {
  return {
    ...state,
    [payload.documentId]: {
      ...state[payload.documentId],
      ...payload.meta,
      state: {
        ...state[payload.documentId].state,
        localUpdatedAt: Date.now(),
        editedAttributes: removeDuplicates([
          ...state[payload.documentId].state.editedAttributes,
          ...Object.keys(payload.meta),
        ]),
      },
    },
  };
};
