import * as React from 'react';
import { createRef } from 'react';
import { modUserProfile } from '::sass-modules';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { VerifyEmail } from '::app/menus/settings/screens/account/components/email/components/verify-email';
import { Icons } from '::shared-components/icon/helpers/icons';
import {
  userSettingsActionCreators,
  ValidatedInputState,
} from '::app/menus/settings/screens/account/reducer/reducer';
import { UserToken, UserTokenType } from '::types/graphql/generated';
import { ChangeEmail } from '::app/menus/settings/screens/account/components/email/components/change-email';

const idPrefix = 'settings::email';
type Props = {
  currentEmail: string;
  email: ValidatedInputState;
  tokens: UserToken[];
  emailVerified: boolean;
};

const Email: React.FC<Props> = ({
  currentEmail,
  tokens,
  emailVerified,
  email,
}) => {
  const verifyEmailToken = tokens.find(
    token => token.type === UserTokenType.EMAIL_VERIFICATION,
  );
  const changeEmailToken = tokens.find(
    token => token.type === UserTokenType.EMAIL_CHANGE,
  );
  const inputProps: ValidatedTextInputProps = {
    label: 'email',
    icon: [Icons.material.email],
    variableName: 'email',
    idPrefix: idPrefix,
    type: 'email',
    required: true,
    inputRef: createRef(),
    value: email?.value || '',
    onChange: userSettingsActionCreators.setEmail,
    sendValidStatusWithValue: true,
    disabled: !emailVerified,
  };
  return (
    <div className={modUserProfile.userProfile__group}>
      <span className={modUserProfile.userProfile__group__name}>email</span>
      <div className={modUserProfile.userProfile__group__elements}>
        <ValidatedTextInput {...inputProps} />

        {emailVerified ? (
          changeEmailToken && (
            <ChangeEmail email={currentEmail} token={changeEmailToken} />
          )
        ) : (
          <VerifyEmail
            emailVerificationPending={Boolean(verifyEmailToken)}
            email={currentEmail}
          />
        )}
      </div>
    </div>
  );
};

export { Email };
