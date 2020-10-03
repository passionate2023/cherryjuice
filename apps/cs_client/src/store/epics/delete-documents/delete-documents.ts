import { filter, ignoreElements, map, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac, ac_, store } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation$ } from '../shared/gql-query';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { DELETE_DOCUMENT } from '::graphql/mutations/document/delete-document';

const asyncStates: AsyncOperation[] = ['idle', 'pending'];
const deleteDocumentsEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac_.documentsList.deleteDocuments,
      ac_.documentsList.deleteDocument,
    ]),
    filter(() =>
      asyncStates.includes(store.getState().documentsList.deleteDocuments),
    ),
    map(action => {
      let selectedIDs: string[];
      if ('payload' in action) {
        selectedIDs = [action['payload']];
      } else selectedIDs = store.getState().documentsList.selectedIDs;
      return selectedIDs;
    }),
    switchMap(selectedIDs => {
      const { documentId } = store.getState().document;
      const fetchedDocuments = selectedIDs.filter(
        id => !id.startsWith('new-document'),
      );
      const deletionInProgress$ = of(
        ac_.documentsList.deleteDocumentsInProgress(),
      );
      const deleteFetchedDocuments$ = gqlMutation$(
        DELETE_DOCUMENT({ documents: { IDs: fetchedDocuments } }),
      ).pipe(ignoreElements());

      const deleteDocumentsFromCache$ = of(
        ac_.documentCache.deleteDocuments(selectedIDs),
      );

      const deletionFulfilled$ = of(
        ac_.documentsList.deleteDocumentsFulfilled(),
      );
      const maybeClearSelectedDocument$ = of(1).pipe(
        tap(() => {
          if (store.getState().documentsList.selectedIDs.includes(documentId)) {
            ac.document.setDocumentId(undefined);
          }
        }),
        ignoreElements(),
      );

      return concat(
        deletionInProgress$,
        deleteFetchedDocuments$,
        deleteDocumentsFromCache$,
        deletionFulfilled$,
        maybeClearSelectedDocument$,
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not perform the deletion',
            description: 'something went wrong',
          },
          actionCreators: [ac_.documentsList.deleteDocumentsFailed],
        }),
      );
    }),
  );
};

export { deleteDocumentsEpic };
