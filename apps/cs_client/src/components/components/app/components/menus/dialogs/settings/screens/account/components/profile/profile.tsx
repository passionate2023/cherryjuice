import * as React from 'react';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { createRef } from 'react';
import {
  userSettingsActionCreators,
  ValidatedInputState,
} from '::root/components/app/components/menus/dialogs/settings/screens/account/reducer/reducer';
import { Icons } from '@cherryjuice/icons';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';

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
    <SettingsGroup name={'profile'}>
      {personalInformation.map(po => (
        <ValidatedTextInput key={po.label} {...po} />
      ))}
    </SettingsGroup>
  );
};

export { Profile };
