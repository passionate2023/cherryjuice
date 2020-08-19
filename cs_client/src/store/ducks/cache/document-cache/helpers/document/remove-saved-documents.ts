import { DocumentCacheState } from '::store/ducks/cache/document-cache';

export const removeSavedDocuments = (
  state: DocumentCacheState,
): DocumentCacheState => {
  return Object.fromEntries(
    Object.entries(state).filter(
      ([
        ,
        {
          updatedAt,
          state: { localUpdatedAt },
        },
      ]) => updatedAt > localUpdatedAt,
    ),
  );
};
