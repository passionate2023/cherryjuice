import { useEffect } from 'react';
import { apolloClient } from '::graphql/client/apollo-client';
import { getToken } from '::root/components/auth/components/reset-password';
import { VERIFY_EMAIL } from '::graphql/mutations/user/verify-email';
import { ac } from '::store/store';
import { AlertType } from '::types/react';
import { properErrorMessage } from '::root/components/auth/hooks/proper-error-message';
import { router } from '::root/router/router';
import { UserTokenType } from '::types/graphql';
import { CHANGE_EMAIL } from '::graphql/mutations/user/change-email';

const verifyEmail = (token: string, userId: string) =>
  apolloClient
    .mutate(VERIFY_EMAIL({ input: { token } }))
    .then(() => {
      if (userId) {
        ac.dialogs.setSnackbar({ message: 'email verified' });
        ac.auth.refreshToken();
      }
    })
    .catch(error => {
      setTimeout(
        () =>
          ac.dialogs.setAlert({
            error,
            title: 'could not verify your email',
            description: properErrorMessage(error),
            type: AlertType.Error,
          }),
        2000,
      );
    })
    .finally(() => {
      if (userId) router.goto.home();
      else router.goto.signIn();
    });

const confirmEmailChange = (token: string, userId) =>
  apolloClient
    .mutate(CHANGE_EMAIL({ input: { token } }))
    .then(() => {
      if (userId) {
        ac.dialogs.setSnackbar({ message: 'email updated' });
        ac.auth.refreshToken();
      }
    })
    .catch(error => {
      setTimeout(
        () =>
          ac.dialogs.setAlert({
            error,
            title: 'could not change your email',
            description: properErrorMessage(error),
            type: AlertType.Error,
          }),
        2000,
      );
    })
    .finally(() => {
      if (userId) router.goto.home();
      else router.goto.signIn();
    });

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const useConsumeToken = ({ userId }: { userId: string }) => {
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (token) {
        const payload = parseJwt(token);
        const type = payload?.type as UserTokenType;
        if (type) {
          switch (type) {
            case UserTokenType.EMAIL_VERIFICATION:
              await verifyEmail(token, userId);
              break;
            case UserTokenType.EMAIL_CHANGE:
              await confirmEmailChange(token, userId);
              break;
            case UserTokenType.PASSWORD_RESET:
              router.goto.resetPassword(token);
              break;
          }
        }
      }
    })();
  }, []);
};

export { useConsumeToken };
