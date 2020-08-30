import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { Privacy } from '::types/graphql/generated';

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
  const document = state[payload.documentId];
  Object.entries(payload.meta).forEach(([key, value]) => {
    document[key] = value;
    if (!document.state.editedAttributes.includes(key))
      document.state.editedAttributes.push(key);
  });
  document.state.localUpdatedAt = Date.now();
  return state;
};
