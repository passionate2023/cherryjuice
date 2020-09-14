import { getDocumentsList } from '::store/selectors/cache/document/document';
import { store } from '::store/store';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { apolloClient } from '::graphql/client/apollo-client';
import { SET_DOCUMENT_STATE } from '::graphql/mutations/document/set-document-state';
import { adaptToPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/adapt-persisted-state';

export const rdx = new Observable(observer => {
  store.subscribe(() => {
    observer.next();
  });
});
export const syncPersistedState = (intervalMs = 5 * 1000) => {
  return rdx
    .pipe(
      debounceTime(intervalMs),
      map(() =>
        getDocumentsList(store.getState())
          .filter(document => {
            return (
              document.persistedState.localUpdatedAt >
              document.persistedState.updatedAt
            );
          })
          .map(document => document.id),
      ),
      filter(documents => Boolean(documents.length)),
      tap(async documents => {
        const state = store.getState();
        for await (const documentId of documents) {
          await apolloClient.mutate(
            SET_DOCUMENT_STATE({
              file_id: documentId,
              state: adaptToPersistedState(
                state.documentCache.documents[documentId].persistedState,
              ),
            }),
          );
        }
      }),
    )
    .subscribe();
};
