import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '../store';
import { Actions } from '../actions.types';
import { gqlQuery } from './shared/gql-query';
import { createTimeoutHandler } from './shared/create-timeout-handler';
import { createErrorHandler } from './shared/create-error-handler';
import { DOCUMENTS_LIST } from '::graphql/queries/documents-list';

const fetchDocumentsListEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac.__.documentsList.fetchDocuments,
      ac.__.documentsList.deleteDocumentsFulfilled,
      ac.__.document.saveFulfilled,
    ]),
    filter(() => store.getState().documentsList.fetchDocuments === 'idle'),
    switchMap(() => {
      const request = gqlQuery(DOCUMENTS_LIST()).pipe(
        map(ac.__.documentsList.fetchDocumentsFulfilled),
      );

      const loading = of(ac.__.documentsList.fetchDocumentsInProgress());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching the documents is taking longer then expected',
            description: 'try refreshing the page',
          },
          due: 15000,
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the documents',
            description: 'Check your network connection',
          },
          actionCreators: [],
        }),
      );
    }),
  );
};

export { fetchDocumentsListEpic };