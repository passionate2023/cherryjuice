import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac_, store } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation$ } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { USER_MUTATION } from '::graphql/mutations';
import {
  OauthSignUpCredentials,
  SignInCredentials,
  SignUpCredentials,
} from '@cherryjuice/graphql-types';
import { alerts } from '::helpers/texts/alerts';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { AlertType } from '::types/react';

const signIn = (payload: SignInCredentials) =>
  gqlMutation$({
    ...USER_MUTATION.signIn,
    variables: USER_MUTATION.signIn.args(payload),
  });
const signUp = (payload: SignUpCredentials) =>
  gqlMutation$({
    ...USER_MUTATION.signUp,
    variables: USER_MUTATION.signUp.args(payload),
  });
const oauthSignUp = (payload: OauthSignUpCredentials) =>
  gqlMutation$({
    ...USER_MUTATION.oauthSignUp,
    variables: USER_MUTATION.oauthSignUp.args(payload),
  });
const refreshToken = () =>
  gqlMutation$({
    ...USER_MUTATION.refreshToken,
    variables: USER_MUTATION.refreshToken.args(),
  });
const asyncStates: AsyncOperation[] = ['idle', 'pending'];
const authEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.auth.signIn, ac_.auth.signUp, ac_.auth.refreshToken]),
    filter(() => asyncStates.includes(store.getState().auth.ongoingOperation)),
    switchMap(action => {
      const online = store.getState().root.online;
      if (!online)
        return of(
          ac_.auth.setAlert({
            type: AlertType.Error,
            title: 'you are offline',
          }),
        );
      let authenticate;
      if ('payload' in action) {
        const { type, payload, meta } = action;
        if (type === ac_.auth.signIn.type) authenticate = signIn(payload);
        else if (type === ac_.auth.signUp.type) {
          if (meta && meta['oauth']) authenticate = oauthSignUp(payload);
          else authenticate = signUp(payload);
        }
      } else authenticate = refreshToken();

      const ip = of(ac_.auth.setAuthenticationInProgress());

      return concat(
        ip,
        authenticate.pipe(map(ac_.auth.setAuthenticationSucceeded)),
        of(ac_.dialogs.clearAlert()),
      ).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Authentication is taking longer then expected',
            description: alerts.tryRefreshingThePage,
          },
          due: 30000,
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not perform the operation',
            description: alerts.somethingWentWrong,
          },
          actionCreators: [
            error =>
              ac_.auth.setAlert({
                title: properErrorMessage(error),
                type: AlertType.Error,
                error,
              }),
          ],
        }),
      );
    }),
  );
};

export { authEpic };
