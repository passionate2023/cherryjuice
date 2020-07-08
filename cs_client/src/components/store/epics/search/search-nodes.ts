import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { QUERY } from '::graphql/queries';
import { store, ac } from '::root/store/store';
import { Actions } from '::root/store/actions.types';
import { gqlQuery } from '::root/store/epics/shared/gql-query';
import { createTimeoutHandler } from '::root/store/epics/shared/create-timeout-handler';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { SearchState } from '::root/store/ducks/search';

const searchStates: SearchState[] = ['stand-by', 'idle'];
const searchNodesEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.search.setSearchQueued]),
    filter(
      () =>
        store.getState().search.query &&
        searchStates.includes(store.getState().search.searchState),
    ),
    switchMap(() => {
      const { query, searchType, searchScope } = store.getState().search;
      const {
        documentId,
        selectedNode: { id: nodeId },
      } = store.getState().document;
      const request = gqlQuery({
        ...QUERY.SEARCH.searchNode,
        variables: QUERY.SEARCH.searchNode.args({
          args: {
            query,
            searchScope,
            searchType,
            documentId,
            nodeId,
          },
        }),
      }).pipe(map(ac.__.search.setSearchFulfilled));

      const loading = of(ac.__.search.setSearchInProgress());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Searching is taking longer then expected',
            description: 'try refreshing the page',
          },
          due: 30000,
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not perform the search',
            description: 'Check your network connection',
          },
          actionCreators: [],
        }),
      );
    }),
  );
};

export { searchNodesEpic };
