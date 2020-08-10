import * as React from 'react';
import { modUserProfile } from '::sass-modules';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { patterns } from '::app/auth/helpers/form-validation';
import { createRef } from 'react';
import {
  userSettingsActionCreators,
  ValidatedInputState,
} from '::app/menus/settings/screens/account/reducer/reducer';
import { Icons } from '::shared-components/icon/helpers/icons';

type Props = {
  firstName: ValidatedInputState;
  lastName: ValidatedInputState;
  username: ValidatedInputState;
};

const idPrefix = 'settings::profile';
const Profile: React.FC<Props> = ({ firstName, lastName, username }) => {
  const personalInformation: ValidatedTextInputProps[] = [
    {
      label: 'first name',
      patterns: [patterns.name],
      icon: [Icons.material['person-circle']],
      minLength: 2,
      required: true,
      variableName: 'firstName',
      inputRef: createRef<HTMLInputElement>(),
      idPrefix,
      value: firstName?.value || '',
      onChange: userSettingsActionCreators.setFirstName,
      sendValidStatusWithValue: true,
    },
    {
      label: 'last name',
      patterns: [patterns.name],
      icon: [Icons.material['person-circle']],
      minLength: 2,
      required: true,
      variableName: 'lastName',
      inputRef: createRef<HTMLInputElement>(),
      idPrefix,
      value: lastName?.value || '',
      onChange: userSettingsActionCreators.setLastName,
      sendValidStatusWithValue: true,
    },
    {
      label: 'username',
      patterns: [patterns.userName],
      icon: [Icons.material.username],
      minLength: 4,
      required: true,
      variableName: 'username',
      inputRef: createRef(),
      idPrefix,
      value: username?.value || '',
      onChange: userSettingsActionCreators.setUserName,
      sendValidStatusWithValue: true,
    },
  ];

  return (
    <div className={modUserProfile.userProfile__group}>
      <span className={modUserProfile.userProfile__group__name}>profile</span>
      <div className={modUserProfile.userProfile__group__elements}>
        {personalInformation.map(po => (
          <ValidatedTextInput key={po.label} {...po} />
        ))}
      </div>
    </div>
  );
};

export { Profile };
