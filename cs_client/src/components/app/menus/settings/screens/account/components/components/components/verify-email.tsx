import * as React from 'react';
import { useCallback, useState } from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { CREATE_EMAIL_VERIFICATION_TOKEN } from '::graphql/mutations/user/create-email-verification-token';
import { ac } from '::root/store/store';
import { AlertType } from '::types/react';
import { EmailVerification } from '::root/store/ducks/auth';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { AsyncOperation } from '::root/store/ducks/document';

type Props = {
  emailVerification: EmailVerification;
  email: string;
};

const VerifyEmail: React.FC<Props> = ({ emailVerification, email }) => {
  const [asyncOperation, setAsyncOperation] = useState<AsyncOperation>('idle');
  const verifyEmail = useCallback(async () => {
    apolloCache.client
      .mutate(CREATE_EMAIL_VERIFICATION_TOKEN())
      .then(() => {
        ac.auth.setEmailVerificationPending();
        ac.dialogs.setSnackbar({
          message: 'email verification sent to ' + email,
        });
      })
      .catch(error =>
        ac.dialogs.setAlert({
          title: 'could not create an email verification token',
          description: properErrorMessage(error),
          error,
          type: AlertType.Error,
        }),
      )
      .finally(() => {
        setAsyncOperation('idle');
      });
  }, []);
  return (
    <ButtonSquare
      disabled={asyncOperation !== 'idle'}
      text={
        emailVerification === 'idle'
          ? 'verify email'
          : 'resend verification email'
      }
      onClick={verifyEmail}
    />
  );
};

export { VerifyEmail };
