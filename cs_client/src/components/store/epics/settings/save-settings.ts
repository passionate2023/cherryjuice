import { filter, map, switchMap, take } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '::root/store/store';
import { Actions } from '::root/store/actions.types';
import { gqlMutation } from '::root/store/epics/shared/gql-query';
import { createTimeoutHandler } from '::root/store/epics/shared/create-timeout-handler';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { AsyncOperation } from '::root/store/ducks/document';
import { UPDATE_USER_PROFILE } from '::graphql/mutations/user/update-user-information';
import { properErrorMessage } from '::app/auth/hooks/proper-error-message';

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
      const showConfirmation = of(ac.__.dialogs.showPasswordModal());
      const updateUserProfile = action$.pipe(
        ofType([ac.__.dialogs.confirmPasswordModal]),
        take(1),
        switchMap(action => {
          const { userProfileChanges } = store.getState().settings;
          userProfileChanges.currentPassword = action.payload;
          const loading = of(ac.__.settings.saveStarted());
          const fulfilled = of(ac.__.settings.saveFulfilled());
          const snackbar = of(
            ac.__.dialogs.setSnackbar({ message: 'settings saved' }),
          );
          return concat(
            loading,
            gqlMutation(
              UPDATE_USER_PROFILE({ userProfile: userProfileChanges }),
            ).pipe(map(ac.__.auth.setAuthenticationSucceeded)),
            fulfilled,
            snackbar,
          ).pipe(
            createTimeoutHandler({
              alertDetails: {
                title: 'Saving is taking longer then expected',
                description: 'try refreshing the page',
              },
              due: 30000,
            }),
            createErrorHandler({
              alertDetails: {
                title: 'Could not save',
                descriptionFactory: properErrorMessage,
              },
              actionCreators: [ac.settings.saveFailed],
            }),
          );
        }),
      );

      return concat(showConfirmation, updateUserProfile);
    }),
  );
};

export { saveSettingsEpic };
