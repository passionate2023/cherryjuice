import * as React from 'react';
import { createRef } from 'react';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { VerifyEmail } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/email/components/verify-email';
import { Icons } from '::root/components/shared-components/icon/helpers/icons';
import {
  userSettingsActionCreators,
  ValidatedInputState,
} from '::root/components/app/components/menus/dialogs/settings/screens/account/reducer/reducer';
import { UserToken, UserTokenType } from '::types/graphql';
import { ChangeEmail } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/email/components/change-email';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';

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
    <SettingsGroup name={'email'}>
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
    </SettingsGroup>
  );
};

export { Email };
