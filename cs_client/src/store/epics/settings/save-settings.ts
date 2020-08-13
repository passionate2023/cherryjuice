import { filter, map, switchMap, take } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { UPDATE_USER_PROFILE } from '::graphql/mutations/user/update-user-information';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';

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
    ofType([ac.__.settings.save]),
    filter(
      () =>
        store.getState().settings.screenHasChanges &&
        savingState.includes(store.getState().settings.saveOperation),
    ),
    switchMap(() => {
      const selectedScreen = store.getState().settings.selectedScreen;
      const loading = of(ac.__.settings.saveStarted());
      const fulfilled = of(ac.__.settings.saveFulfilled());
      const snackbar = of(
        ac.__.dialogs.setSnackbar({ message: 'settings saved' }),
      );
      if (selectedScreen === 'keyboard shortcuts') {
        const requestUpdateHotkeys = of(ac.__.cache.syncHotKeysWithCache());
        const saveHotKeys = action$.pipe(
          ofType([ac.__.cache.updateHotkeys]),
          take(1),
          switchMap(action => {
            // eslint-disable-next-line no-console
            console.log(action);
            return fulfilled;
          }),
        );

        return concat(requestUpdateHotkeys, saveHotKeys);
      } else if (selectedScreen === 'manage account') {
        const showConfirmation = of(ac.__.dialogs.showPasswordModal());
        const updateUserProfile = action$.pipe(
          ofType([ac.__.dialogs.confirmPasswordModal]),
          take(1),
          switchMap(action => {
            const { userProfileChanges } = store.getState().settings;
            userProfileChanges.currentPassword = action.payload;

            return concat(
              loading,
              gqlMutation(
                UPDATE_USER_PROFILE({ userProfile: userProfileChanges }),
              ).pipe(map(ac.__.auth.setAuthenticationSucceeded)),
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
