import { filter, flatMap, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac_ } from '../store';
import { Actions } from '../actions.types';
import { gqlQuery$ } from './shared/gql-query';
import { createTimeoutHandler } from './shared/create-timeout-handler';
import { createErrorHandler } from './shared/create-error-handler';
import { alerts } from '::helpers/texts/alerts';
import { FOLDERS } from '::graphql/queries/folders';

export const fetchFoldersEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.home.fetchFolders, ac_.auth.setAuthenticationSucceeded]),
    filter(() => store.getState().home.asyncOperations.fetchFolders === 'idle'),
    switchMap(() => {
      const request = gqlQuery$(FOLDERS()).pipe(
        flatMap(folders => {
          return concat(of(ac_.home.fetchFoldersFulfilled(folders)));
        }),
      );

      const loading = of(ac_.home.fetchFoldersInProgress());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching folders is taking longer then expected',
            description: alerts.tryRefreshingThePage,
          },
          due: 5000,
          actionCreators: [ac_.home.fetchFoldersFailed],
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch your folders',
            description: alerts.somethingWentWrong,
          },
          actionCreators: [ac_.home.fetchFoldersFailed],
          mode: 'snackbar',
        }),
      );
    }),
  );
};
