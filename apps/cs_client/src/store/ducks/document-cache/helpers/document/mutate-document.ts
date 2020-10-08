import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { Privacy } from '@cherryjuice/graphql-types';

type DocumentMeta = {
  name?: string;
  privacy?: Privacy;
};
export type MutateDocumentProps = {
  documentId: string;
  meta: DocumentMeta;
};

export const mutateDocument = (
  state: DocumentCacheState,
  payload: MutateDocumentProps,
): DocumentCacheState => {
  const document = state.documents[payload.documentId];
  Object.entries(payload.meta).forEach(([key, value]) => {
    document[key] = value;
    if (!document.localState.editedAttributes.includes(key))
      document.localState.editedAttributes.push(key);
  });
  document.localState.localUpdatedAt = Date.now();
  return state;
};
