import { getDocumentsList } from '::store/selectors/cache/document/document';
import { ac, store } from '::store/store';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { apolloClient } from '::graphql/client/apollo-client';
import { SET_DOCUMENT_STATE } from '::graphql/mutations/document/set-document-state';
import { adaptToPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/adapt-persisted-state';
import { DocumentState } from '::types/graphql/generated';

export const rdx = new Observable(observer => {
  store.subscribe(() => {
    observer.next();
  });
});
export type DocumentStateTuple = [string, DocumentState];
export const syncPersistedState = (intervalMs = 2 * 1000) => {
  return rdx
    .pipe(
      debounceTime(intervalMs),
      map(() => {
        const state = store.getState();
        return getDocumentsList(store.getState())
          .filter(document => {
            const updated =
              document.persistedState.localUpdatedAt >
              document.persistedState.updatedAt;
            const opened =
              document.persistedState.localLastOpenedAt >
              document.persistedState.lastOpenedAt;
            return (
              !document.id.startsWith('new-document') && (updated || opened)
            );
          })
          .map<DocumentStateTuple>(document => [
            document.id,
            adaptToPersistedState(
              state.documentCache.documents[document.id].persistedState,
            ),
          ]);
      }),
      filter(documents => !!documents.length),
      tap(async documents => {
        for await (const [documentId, persistedState] of documents) {
          await apolloClient.mutate(
            SET_DOCUMENT_STATE({
              file_id: documentId,
              state: persistedState,
            }),
          );
        }
      }),
      tap(documents => {
        ac.documentCache.neutralizePersistedState(documents);
      }),
    )
    .subscribe();
};
