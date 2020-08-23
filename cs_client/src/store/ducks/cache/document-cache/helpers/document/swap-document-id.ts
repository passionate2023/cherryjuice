import { DocumentCacheState } from '::store/ducks/cache/document-cache';
export type SwapDocumentIdParams = { newId: string; oldId: string };
export const swapDocumentId = (
  state: DocumentCacheState,
  { newId, oldId }: SwapDocumentIdParams,
) => {
  state[newId] = state[oldId];
  delete state[oldId];
  return {
    ...state,
  };
};
