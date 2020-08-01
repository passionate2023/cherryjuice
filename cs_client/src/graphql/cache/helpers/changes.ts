import {
  getInitialDocumentState,
  CacheState,
  EditedDocumentMeta,
} from '../initial-state';

const changesHelpers = (state: CacheState) => ({
  document: (documentId?: string) => {
    return {
      get created(): string[] {
        return Object.entries(state.modifications.document)
          .filter(([, { isNew }]) => isNew)
          .map(([id]) => id);
      },
      get unsaved(): string[] {
        return Object.keys(state.modifications.document).filter(documentId =>
          Boolean(
            changesHelpers(state).document(documentId).meta.size +
              changesHelpers(state).document(documentId).node.created.length +
              changesHelpers(state).document(documentId).node.deleted.length +
              changesHelpers(state).document(documentId).node.html.length +
              changesHelpers(state).document(documentId).node.meta.length +
              changesHelpers(state).document(documentId).image.created.length +
              changesHelpers(state).document(documentId).image.deleted.length,
          ),
        );
      },
      get meta(): EditedDocumentMeta {
        return state.modifications.document[documentId].meta;
      },
      node: {
        get html(): string[] {
          return Array.from(
            state.modifications.document[documentId].node.content,
          );
        },
        get meta(): [string, Set<string>][] {
          return Array.from(state.modifications.document[documentId].node.meta);
        },
        get created(): string[] {
          return Array.from(
            state.modifications.document[documentId].node.created,
          );
        },
        get deleted(): string[] {
          return Array.from(
            state.modifications.document[documentId].node.deleted,
          );
        },
      },
      image: {
        get deleted(): [string, Set<string>][] {
          return Array.from(
            state.modifications.document[documentId].image.deleted,
          );
        },
        get created(): [string, Set<string>][] {
          return Array.from(
            state.modifications.document[documentId].image.created,
          );
        },
      },
    };
  },

  isNodeNew: (documentId: string) => (nodeId: string): boolean =>
    state.modifications.document[documentId].node.created[nodeId],
  initDocumentChangesState: (documentId: string) => {
    if (documentId && !state.modifications.document[documentId])
      state.modifications.document[documentId] = getInitialDocumentState();
  },
  resetDocumentChangesState: (documentId: string) => {
    state.modifications.document[documentId] = getInitialDocumentState();
  },
});

export { changesHelpers };
