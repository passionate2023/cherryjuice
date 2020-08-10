import * as React from 'react';
import { useEffect } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { getToken } from '::app/auth/components/reset-password';
import { ac } from '::root/store/store';
import { AlertType } from '::types/react';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { router } from '::root/router/router';
import { CHANGE_EMAIL } from '::graphql/mutations/user/change-email';

type Props = {};
const ChangeEmail: React.FC<Props> = () => {
  useEffect(() => {
    const token = getToken();
    if (token) {
      apolloCache.client
        .mutate(CHANGE_EMAIL({ input: { token } }))
        .then(() => {
          ac.dialogs.setSnackbar({ message: 'email updated' });
          ac.auth.refreshToken();
        })
        .catch(error => {
          return setTimeout(
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
          router.goto.home();
        });
    }
  }, []);
  return <></>;
};

export { ChangeEmail };
