import * as React from 'react';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { createRef } from 'react';
import { patterns } from '::root/components/auth/helpers/form-validation';
import {
  userSettingsActionCreators,
  ValidatedInputState,
} from '::root/components/app/components/menus/dialogs/settings/screens/account/reducer/reducer';
import { modUserProfile } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/helpers/icons';

const idPrefix = 'settings::password';

type Props = {
  newPassword: ValidatedInputState;
  newPasswordConfirmation: ValidatedInputState;
};
const Password: React.FC<Props> = ({
  newPassword,
  newPasswordConfirmation,
}) => {
  const changePassword: ValidatedTextInputProps[] = [
    {
      inputRef: createRef(),
      variableName: 'newPassword',
      patterns: [patterns.password],
      icon: [Icons.material.lock],
      label: 'new password',
      type: 'password',
      minLength: 8,
      required: true,
      idPrefix,
      value: newPassword?.value || '',
      sendValidStatusWithValue: true,
      onChange: userSettingsActionCreators.setNewPassword,
    },
    {
      inputRef: createRef(),
      variableName: 'newPasswordConfirmation',
      patterns: [patterns.password],
      icon: [Icons.material.lock],
      label: 'confirm new password',
      type: 'password',
      minLength: 8,
      required: true,
      idPrefix,
      value: newPasswordConfirmation?.value || '',
      sendValidStatusWithValue: true,
      onChange: userSettingsActionCreators.setNewPasswordConfirmation,
    },
  ];
  return (
    <div className={modUserProfile.userProfile__group}>
      <span className={modUserProfile.userProfile__group__name}>password</span>
      <div className={modUserProfile.userProfile__group__elements}>
        {changePassword.map(po => (
          <ValidatedTextInput key={po.label} {...po} />
        ))}
      </div>
    </div>
  );
};

export { Password };
