import * as React from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { CREATE_EMAIL_VERIFICATION_TOKEN } from '::graphql/mutations/user/create-email-verification-token';
import { ac } from '::root/store/store';
import { AlertType } from '::types/react';
import { properErrorMessage } from '::app/auth/hooks/proper-error-message';
import { useMutation } from '::hooks/graphql/use-mutation';

type Props = {
  emailVerificationPending: boolean;
  email: string;
};

const VerifyEmail: React.FC<Props> = ({ emailVerificationPending, email }) => {
  const [verifyEmail, verifyEmailStatus] = useMutation({
    gqlPipe: CREATE_EMAIL_VERIFICATION_TOKEN,
    variables: undefined,
    onFailure: error =>
      ac.dialogs.setAlert({
        title: 'could not create an email verification request',
        description: properErrorMessage(error),
        error,
        type: AlertType.Error,
      }),
    onSuccess: () => {
      ac.auth.refreshToken();
      ac.dialogs.setSnackbar({
        message: 'verification email sent to ' + email,
      });
    },
  });
  return (
    <ButtonSquare
      disabled={verifyEmailStatus !== 'idle'}
      text={
        emailVerificationPending === false
          ? 'verify email'
          : 'resend verification email'
      }
      onClick={verifyEmail}
    />
  );
};

export { VerifyEmail };
