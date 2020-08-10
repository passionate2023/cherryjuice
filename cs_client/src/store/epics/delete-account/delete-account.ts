import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { USER_MUTATION } from '::graphql/mutations';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';

const deleteAccount = (currentPassword: string) =>
  gqlMutation({
    ...USER_MUTATION.deleteAccount,
    variables: USER_MUTATION.deleteAccount.args(currentPassword),
  });

const asyncStates: AsyncOperation[] = ['idle', 'pending'];
const deleteAccountEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.auth.deleteAccount]),
    filter(() => asyncStates.includes(store.getState().auth.ongoingOperation)),
    switchMap(() => {
      const showConfirmation = of(ac.__.dialogs.showPasswordModal());
      const updateUserProfile = action$.pipe(
        ofType([ac.__.dialogs.confirmPasswordModal]),
        switchMap(action => {
          const ip = of(ac.__.auth.setAuthenticationInProgress());
          return concat(
            ip,
            deleteAccount(action.payload).pipe(
              map(data => {
                if (data !== store.getState().auth.user.id) {
                  throw new Error('could not delete the account');
                }
                return ac.__.root.resetState();
              }),
            ),
          ).pipe(
            createTimeoutHandler({
              alertDetails: {
                title: 'The Operation is taking longer then expected',
                description: 'try refreshing the page',
              },
              due: 30000,
            }),
            createErrorHandler({
              alertDetails: {
                title: 'Could not perform the operation',
                descriptionFactory: properErrorMessage,
              },
              actionCreators: [ac.__.auth.setAuthenticationFailed],
            }),
          );
        }),
      );
      return concat(showConfirmation, updateUserProfile);
    }),
  );
};

export { deleteAccountEpic };
