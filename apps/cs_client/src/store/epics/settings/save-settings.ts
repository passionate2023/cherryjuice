import { filter, ignoreElements, map, switchMap, take } from 'rxjs/operators';
import { concat, EMPTY, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac, ac_, Store, store } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation$ } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { UPDATE_USER_PROFILE } from '::graphql/mutations/user/update-user-profile';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';
import { UPDATE_USER_SETTINGS } from '::graphql/mutations/user/update-user-settings';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { screenHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/settings/settings';
import { alerts } from '::helpers/texts/alerts';

const timeoutHandler = () =>
  createTimeoutHandler({
    alertDetails: {
      title: 'Saving is taking longer then expected',
      description: alerts.tryRefreshingThePage,
    },
    due: 30000,
  });

const errorHandler = () =>
  createErrorHandler({
    alertDetails: {
      title: 'Could not save',
      descriptionFactory: properErrorMessage,
    },
    actionCreators: [ac.settings.saveFailed],
  });

const loading = () => of(ac_.settings.saveStarted());

const fulfilled = () =>
  concat(
    of(ac_.settings.saveFulfilled()),
    of(ac_.dialogs.setSnackbar({ message: 'settings saved' })),
  );

const saveEditorAndHotkeys = (state: Store, changes) => {
  return gqlMutation$(
    UPDATE_USER_SETTINGS({
      input: {
        hotKeys: changes.hotkeySettings ? getHotkeys(state) : undefined,
        editorSettings: changes.editorSettings
          ? state.editorSettings.current
          : undefined,
      },
    }),
  ).pipe(map(ac_.auth.setAuthenticationSucceeded));
};

const updateUserProfile = (action$: Observable<Actions>) => {
  const showConfirmation = of(ac_.dialogs.showPasswordModal());
  const updateUserProfile = action$.pipe(
    ofType([ac_.dialogs.confirmPasswordModal]),
    take(1),
    switchMap(action => {
      const { userProfileChanges } = store.getState().settings;
      userProfileChanges.currentPassword = action.payload;

      return concat(
        gqlMutation$(
          UPDATE_USER_PROFILE({ userProfile: userProfileChanges }),
        ).pipe(map(ac_.auth.setAuthenticationSucceeded)),
      );
    }),
  );
  return concat(showConfirmation, updateUserProfile);
};
const noop = () => EMPTY.pipe(ignoreElements());
const savingState: AsyncOperation[] = ['idle', 'pending'];
const saveSettingsEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.settings.save]),
    filter(
      () =>
        screenHasUnsavedChanges(store.getState()) &&
        savingState.includes(store.getState().settings.saveOperation),
    ),
    switchMap(() => {
      const state = store.getState();
      const changes = {
        hotkeySettings: !!state.hotkeySettings.previous,
        editorSettings: !!state.editorSettings.previous,
        manageAccount: !!state.settings.userProfileChanges,
      };
      const loading$ = loading();
      const fulfilled$ = fulfilled();

      let saveEditorAndHotkeys$: Observable<unknown> = noop();
      let updateUserProfile$: Observable<unknown> = noop();
      if (changes.hotkeySettings || changes.editorSettings)
        saveEditorAndHotkeys$ = saveEditorAndHotkeys(state, changes);

      if (changes.manageAccount)
        updateUserProfile$ = updateUserProfile(action$);

      return concat(
        loading$,
        updateUserProfile$,
        saveEditorAndHotkeys$,
        fulfilled$,
      ).pipe(timeoutHandler(), errorHandler());
    }),
  );
};

export { saveSettingsEpic };
