import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';

export const removeSavedDocuments = (
  state: DocumentCacheState,
): DocumentCacheState => {
  return Object.fromEntries(
    Object.entries(state).map(([, document]) => {
      const uneditedDocument =
        document.updatedAt > document.state.localUpdatedAt;
      return uneditedDocument
        ? [document.id, document]
        : [
            document.id,
            {
              ...document,
              nodes: {},
              state: getDefaultState({ existingState: document.state }),
            },
          ];
    }),
  );
};
