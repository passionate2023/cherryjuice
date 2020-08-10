import * as React from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { ac } from '::root/store/store';
import { AlertType } from '::types/react';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { CREATE_EMAIL_CHANGE_TOKEN } from '::graphql/mutations/user/create-email-change-token';
import { UserToken } from '::types/graphql/generated';
import { useMutation } from '::hooks/graphql/use-mutation';
import { modUserProfile } from '::sass-modules';
import { CANCEL_EMAIL_CHANGE_TOKEN } from '::graphql/mutations/user/cancel-email-change-token';
type Props = {
  email: string;
  token: UserToken;
};

const ChangeEmail: React.FC<Props> = ({
  token: { meta: tokenMeta, id: tokenId },
  email,
}) => {
  const [resendToken, resendTokenStatus] = useMutation({
    gqlPipe: CREATE_EMAIL_CHANGE_TOKEN,
    variables: { input: { email: tokenMeta.newEmail } },
    onFailure: error => {
      ac.dialogs.setAlert({
        title: 'could not refresh token',
        description: properErrorMessage(error),
        error,
        type: AlertType.Error,
      });
    },
    onSuccess: () => {
      ac.auth.refreshToken();
      ac.dialogs.setSnackbar({
        message: 'email verification sent to ' + email,
      });
    },
  });
  const [cancelToken, cancelTokenStatus] = useMutation({
    gqlPipe: CANCEL_EMAIL_CHANGE_TOKEN,
    variables: { input: { tokenId } },
    onFailure: error => {
      ac.dialogs.setAlert({
        title: 'could not refresh token',
        description: properErrorMessage(error),
        error,
        type: AlertType.Error,
      });
    },
    onSuccess: () => {
      ac.auth.refreshToken();
      ac.dialogs.setSnackbar({
        message: 'email change canceled',
      });
    },
  });
  const actionInProgress =
    resendTokenStatus !== 'idle' && cancelTokenStatus !== 'idle';
  return (
    <div className={modUserProfile.userProfile__changeEmail}>
      <span className={modUserProfile.userProfile__changeEmail__status}>
        email change to <b>{tokenMeta.newEmail}</b> is pending
      </span>
      <div className={modUserProfile.userProfile__changeEmail__buttons}>
        <ButtonSquare
          disabled={actionInProgress}
          text={'resend verification email'}
          onClick={resendToken}
        />
        <ButtonSquare
          disabled={actionInProgress}
          text={'cancel'}
          onClick={cancelToken}
        />
      </div>
    </div>
  );
};

export { ChangeEmail };
