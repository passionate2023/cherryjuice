import { filter, ignoreElements, map, switchMap, take } from 'rxjs/operators';
import { concat, defer, EMPTY, interval, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac, ac_, store } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { UPDATE_USER_PROFILE } from '::graphql/mutations/user/update-user-profile';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';
import { UPDATE_USER_SETTINGS } from '::graphql/mutations/user/update-user-settings';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { screenHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/settings/settings';

const timeoutHandler = () =>
  createTimeoutHandler({
    alertDetails: {
      title: 'Saving is taking longer then expected',
      description: 'try refreshing the page',
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
        hk: state.settings.screenHasChanges,
        editorSettings: !!state.editorSettings.previous,
        manageAccount: !!state.settings.userProfileChanges,
      };
      const loading$ = of(ac_.settings.saveStarted());
      const fulfilled$ = concat(
        of(ac_.settings.saveFulfilled()),
        of(ac_.dialogs.setSnackbar({ message: 'settings saved' })),
      );
      if (changes.hk || changes.editorSettings) {
        const syncHKState$ = changes.hk
          ? concat(
              of(ac_.cache.syncHotKeysWithCache()),
              interval(10).pipe(
                filter(
                  () => !store.getState().cache.settings.syncHotKeysWithCache,
                ),
                take(1),
                ignoreElements(),
              ),
            )
          : EMPTY.pipe(ignoreElements());
        const saveSettings$ = defer(() =>
          gqlMutation(
            UPDATE_USER_SETTINGS({
              input: {
                hotKeys: changes.hk ? getHotkeys(state) : undefined,
                editorSettings: changes.editorSettings
                  ? state.editorSettings.current
                  : undefined,
              },
            }),
          ),
        ).pipe(map(ac_.auth.setAuthenticationSucceeded));
        return concat(loading$, syncHKState$, saveSettings$, fulfilled$).pipe(
          timeoutHandler(),
          errorHandler(),
        );
      } else if (changes.manageAccount) {
        const showConfirmation = of(ac_.dialogs.showPasswordModal());
        const updateUserProfile = action$.pipe(
          ofType([ac_.dialogs.confirmPasswordModal]),
          take(1),
          switchMap(action => {
            const { userProfileChanges } = store.getState().settings;
            userProfileChanges.currentPassword = action.payload;

            return concat(
              loading$,
              gqlMutation(
                UPDATE_USER_PROFILE({ userProfile: userProfileChanges }),
              ).pipe(map(ac_.auth.setAuthenticationSucceeded)),
              fulfilled$,
            ).pipe(timeoutHandler(), errorHandler());
          }),
        );
        return concat(showConfirmation, updateUserProfile);
      }
    }),
  );
};

export { saveSettingsEpic };
