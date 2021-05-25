import { ac, store } from '::store/store';
import { DocumentState } from '@cherryjuice/graphql-types';
import { rdx } from '::store/tasks/sync-persisted-state';
import { saveFoldersChanges } from '::store/tasks/sync-folders/helpers/save-folders-changes/save-folders-changes';
import { concatMap, debounceTime, filter, tap } from 'rxjs/operators';
import { from } from 'rxjs';

export type DocumentStateTuple = [string, DocumentState];
export const syncFolders = (intervalMs = 2 * 1000) => {
  return rdx
    .pipe(
      debounceTime(intervalMs),
      filter(() => {
        const state = store.getState();
        if (!state.root.online) return false;
        return (
          !!state.home.changes.folders.deleted.length ||
          !!state.home.changes.folders.created.length ||
          !!Object.keys(state.home.changes.folders.edited).length
        );
      }),
      concatMap(() => {
        return from(saveFoldersChanges(store.getState().home)).pipe(
          tap(() => {
            ac.home.fetchFolders();
          }),
        );
      }),
    )
    .subscribe();
};
