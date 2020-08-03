import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '::root/store/store';
import { Actions } from '::root/store/actions.types';
import { gqlMutation } from '::root/store/epics/shared/gql-query';
import { createTimeoutHandler } from '::root/store/epics/shared/create-timeout-handler';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { AsyncOperation } from '::root/store/ducks/document';
import { USER_MUTATION } from '::graphql/mutations';
import {
  SignInCredentials,
  SignUpCredentials,
} from '::types/graphql/generated';

const signIn = (payload: SignInCredentials) =>
  gqlMutation({
    ...USER_MUTATION.signIn,
    variables: USER_MUTATION.signIn.args(payload),
  });
const signUp = (payload: SignUpCredentials) =>
  gqlMutation({
    ...USER_MUTATION.signUp,
    variables: USER_MUTATION.signUp.args(payload),
  });
const refreshToken = () =>
  gqlMutation({
    ...USER_MUTATION.refreshToken,
    variables: USER_MUTATION.refreshToken.args(),
  });
const asyncStates: AsyncOperation[] = ['idle', 'pending'];
const authEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.auth.signIn, ac.__.auth.signUp, ac.__.auth.refreshToken]),
    filter(() => asyncStates.includes(store.getState().auth.ongoingOperation)),
    switchMap(action => {
      let authenticate;
      if ('payload' in action) {
        const { type, payload } = action;
        if (type === ac.__.auth.signIn.type) authenticate = signIn(payload);
        else if (type === ac.__.auth.signUp.type)
          authenticate = signUp(payload);
      } else authenticate = refreshToken();

      const ip = of(ac.__.auth.setAuthenticationInProgress());

      return concat(
        ip,
        authenticate.pipe(map(ac.__.auth.setAuthenticationSucceeded)),
        of(ac.__.dialogs.clearAlert()),
      ).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Authentication is taking longer then expected',
            description: 'try refreshing the page',
          },
          due: 30000,
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not perform the operation',
            description: 'Check your network connection',
          },
          actionCreators: [ac.__.auth.setAuthenticationFailed],
        }),
      );
    }),
  );
};

export { authEpic };
