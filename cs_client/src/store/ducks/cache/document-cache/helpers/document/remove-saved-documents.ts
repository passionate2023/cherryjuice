import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { getDefaultLocalState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-local-state';

export const removeSavedDocuments = (
  state: DocumentCacheState,
): DocumentCacheState => {
  return Object.fromEntries(
    Object.entries(state)
      .filter(([id]) => !id.startsWith('new-document'))
      .map(([, document]) => {
        const uneditedDocument =
          document.updatedAt > document.localState.updatedAt;
        return uneditedDocument
          ? [document.id, document]
          : [
              document.id,
              {
                ...document,
                nodes: {},
                persistedState: document.persistedState,
                localState: getDefaultLocalState(document.id, document.nodes),
              },
            ];
      }),
  );
};
