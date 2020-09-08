import {  merge, Observable, of } from 'rxjs';
import { Actions } from '::store/actions.types';
import { ofType } from 'deox';
import { ac_, store } from '::store/store';
import { debounceTime, switchMap } from 'rxjs/operators';
import { filterTree } from '::store/ducks/cache/document-cache/helpers/node/filter-tree/filter-tree';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const filterTreeEpic = (action$: Observable<Actions>) => {
  return merge(
    action$.pipe(ofType([ac_.document.setNodesFilter]), debounceTime(200)),
    action$.pipe(ofType([ac_.document.clearNodesFilter])),
  ).pipe(
    switchMap(action => {
      const filter = action['payload'];
      let matchingNodes;
      if (filter) {
        const nodes = getCurrentDocument(store.getState())?.nodes || {};
        matchingNodes = filterTree(filter, nodes);
        matchingNodes[0] = true;
        return of(ac_.document.setFilteredNodes(matchingNodes));
      } else return of(ac_.document.clearFilteredNodes());
    }),
  );
};

export { filterTreeEpic };
