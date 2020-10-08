import { Observable, of } from 'rxjs';
import { Actions } from '::store/actions.types';
import { ofType } from 'deox';
import { ac_ } from '::store/store';
import { debounceTime, switchMap } from 'rxjs/operators';

const hotkeySettingsDuplicates = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac_.hotkeySettings.setKey,
      ac_.hotkeySettings.toggleMeta,
      ac_.hotkeySettings.resetToDefaults,
      ac_.hotkeySettings.undoChanges,
    ]),
    debounceTime(200),
    switchMap(() => {
      return of(ac_.hotkeySettings.calculateDuplicates());
    }),
  );
};
export { hotkeySettingsDuplicates };
