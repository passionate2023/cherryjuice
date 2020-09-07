import { filter, flatMap, map, switchMap, take } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac, ac_ } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { UPDATE_USER_PROFILE } from '::graphql/mutations/user/update-user-profile';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';
import { UPDATE_USER_SETTINGS } from '::graphql/mutations/user/update-user-settings';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { HotKeys } from '::types/graphql/generated';

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
        store.getState().settings.screenHasChanges &&
        savingState.includes(store.getState().settings.saveOperation),
    ),
    switchMap(() => {
      const selectedScreen = store.getState().settings.selectedScreen;
      const loading = of(ac_.settings.saveStarted());
      const fulfilled = of(ac_.settings.saveFulfilled());
      const snackbar = of(
        ac_.dialogs.setSnackbar({ message: 'settings saved' }),
      );
      if (selectedScreen === 'keyboard shortcuts') {
        const requestUpdateHotkeys = of(ac_.cache.syncHotKeysWithCache());
        const waitForCacheMerge = of(
          new Promise<HotKeys>(res => {
            const interval = setInterval(() => {
              const updatesMerged = !store.getState().cache.settings
                .syncHotKeysWithCache;
              if (updatesMerged) {
                clearInterval(interval);
                res(getHotkeys(store.getState()));
              }
            }, 10);
          }),
        ).pipe(
          flatMap(async hotKeys =>
            gqlMutation(
              UPDATE_USER_SETTINGS({
                input: { hotKeys: await hotKeys },
              }),
            ),
          ),
          flatMap(o => o.pipe(map(ac_.auth.setAuthenticationSucceeded))),
        );

        return concat(
          loading,
          requestUpdateHotkeys,
          waitForCacheMerge,
          fulfilled,
          snackbar,
        ).pipe(timeoutHandler(), errorHandler());
      } else if (selectedScreen === 'manage account') {
        const showConfirmation = of(ac_.dialogs.showPasswordModal());
        const updateUserProfile = action$.pipe(
          ofType([ac_.dialogs.confirmPasswordModal]),
          take(1),
          switchMap(action => {
            const { userProfileChanges } = store.getState().settings;
            userProfileChanges.currentPassword = action.payload;

            return concat(
              loading,
              gqlMutation(
                UPDATE_USER_PROFILE({ userProfile: userProfileChanges }),
              ).pipe(map(ac_.auth.setAuthenticationSucceeded)),
              fulfilled,
              snackbar,
            ).pipe(timeoutHandler(), errorHandler());
          }),
        );
        return concat(showConfirmation, updateUserProfile);
      }
    }),
  );
};

export { saveSettingsEpic };
