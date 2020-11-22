import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { QUERY } from '::graphql/queries';
import { store, ac_, ac } from '../../store';
import { Actions } from '../../actions.types';
import { gqlQuery$ } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { SearchState } from '../../ducks/search';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { alerts } from '::helpers/texts/alerts';

const searchStates: SearchState[] = ['stand-by', 'idle'];
const searchNodesEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac_.search.setSearchQueued,
      ac_.search.setSearchScope,
      ac_.search.setSearchOptions,
      ac_.search.setSearchTarget,
      ac_.search.setSearchType,
      ac_.search.setSortBy,
      ac_.search.toggleSortDirection,
      ac_.search.setCreatedAtTimeFilter,
      ac_.search.setUpdatedAtTimeFilter,
    ]),
    filter(() => searchStates.includes(store.getState().search.searchState)),
    switchMap(() => {
      const document = getCurrentDocument(store.getState());
      const documentId = document?.id;
      if (!store.getState().search.query || !documentId)
        return of(ac_.search.setSearchStandBy());
      else {
        const {
          query,
          searchTarget,
          searchScope,
          searchType,
          searchOptions,
          createdAtTimeFilter,
          updatedAtTimeFilter,
          sortOptions,
        } = store.getState().search;
        const nodeId =
          document.nodes[document.persistedState.selectedNode_id].id;
        const request = gqlQuery$({
          ...QUERY.SEARCH.searchNode,
          variables: QUERY.SEARCH.searchNode.args({
            args: {
              query,
              searchScope,
              searchTarget,
              documentId,
              nodeId,
              searchType,
              searchOptions,
              createdAtTimeFilter,
              updatedAtTimeFilter,
              sortOptions,
            },
          }),
        }).pipe(map(ac_.search.setSearchFulfilled));

        const loading = of(ac_.search.setSearchInProgress());
        return concat(loading, request).pipe(
          createTimeoutHandler({
            alertDetails: {
              title: 'Searching is taking longer then expected',
              description: alerts.tryRefreshingThePage,
            },
            due: 30000,
          }),
          createErrorHandler({
            alertDetails: {
              title: 'Could not perform the search',
              description: alerts.somethingWentWrong,
            },
            actionCreators: [ac.search.setSearchStandBy],
          }),
        );
      }
    }),
  );
};

export { searchNodesEpic };
