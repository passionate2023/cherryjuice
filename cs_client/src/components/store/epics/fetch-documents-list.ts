import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { store, ac } from '::root/store/store';
import { Actions } from '../actions.types';
import { gqlQuery } from '::root/store/epics/shared/gql-query';
import { createTimeoutHandler } from './shared/create-timeout-handler';
import { createErrorHandler } from './shared/create-error-handler';

const fetchDocumentsListEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.documentsList.fetchDocuments]),
    filter(() => store.getState().documentsList.fetchDocuments === 'idle'),
    switchMap(() => {
      const request = gqlQuery({
        ...QUERY_DOCUMENTS.documentMeta,
      }).pipe(map(ac.__.documentsList.fetchDocumentsFulfilled));

      const loading = of(ac.__.documentsList.fetchDocumentsInProgress());
      return concat(loading, request).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the documents',
            description: 'Check your network connection',
          },
          actionCreators: [],
        }),
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching the documents is taking longer then expected',
            description: 'try refreshing the page',
          },
          due: 15000,
        }),
      );
    }),
  );
};

export { fetchDocumentsListEpic };
