import { Observable, of } from 'rxjs';
import { Actions } from '::store/actions.types';
import { ofType } from 'deox';
import { ac_ } from '::store/store';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { pagesManager } from '@cherryjuice/editor';

export const cachePagesEpic = (action$: Observable<Actions>) => {
  const state = {
    caching: false,
  };
  return action$.pipe(
    ofType([ac_.documentCache.cachePages]),
    filter(() => !state.caching),
    tap(() => void (state.caching = true)),
    tap(pagesManager.cachePages),
    mergeMap(() => {
      state.caching = false;
      return of(ac_.documentCache.cachingPagesFulfilled());
    }),
  );
};
