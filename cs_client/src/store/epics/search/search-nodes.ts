import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { QUERY } from '::graphql/queries';
import { store, ac } from '../../store';
import { Actions } from '../../actions.types';
import { gqlQuery } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { SearchState } from '../../ducks/search';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const searchStates: SearchState[] = ['stand-by', 'idle'];
const searchNodesEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.search.setSearchQueued]),
    filter(() => searchStates.includes(store.getState().search.searchState)),
    switchMap(() => {
      if (!store.getState().search.query)
        return of(ac.__.search.setSearchStandBy());
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
        const document = getCurrentDocument(store.getState());
        const documentId = document.id;
        const nodeId = document.nodes[document.state.selectedNode_id].id;
        const request = gqlQuery({
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
            actionCreators: [ac.search.setSearchStandBy],
          }),
        );
      }
    }),
  );
};

export { searchNodesEpic };
