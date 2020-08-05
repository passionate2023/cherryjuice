import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { modUserProfile } from '::sass-modules';

import {
  userSettingsActionCreators,
  userSettingsReducer,
} from '::app/menus/settings/screens/account/components/components/reducer/reducer';
import { createRef, useEffect, useReducer } from 'react';
import { UpdateUserProfileIt } from '::types/graphql/generated';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { patterns } from '::auth/helpers/form-validation';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';

const mapState = (state: Store) => ({
  token: state.auth?.token,
  currentSettings: {
    firstName: state.auth.user.firstName,
    lastName: state.auth.user.lastName,
    email: state.auth.user.email,
    username: state.auth.user.username,
  },
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const UserProfile: React.FC<Props & PropsFromRedux> = ({
  currentSettings,
  token,
}) => {
  const [state, dispatch] = useReducer(userSettingsReducer, currentSettings);
  useEffect(() => {
    userSettingsActionCreators.__setDispatch(dispatch);
  }, []);

  useEffect(() => {
    userSettingsActionCreators.reset(currentSettings);
  }, [token]);
  const idPrefix = 'sign-up';
  const personalInformation: ValidatedTextInputProps[] = [
    {
      label: 'first name',
      patterns: [patterns.name],
      minLength: 2,
      required: true,
      variableName: 'firstName',
      inputRef: createRef<HTMLInputElement>(),
      idPrefix,
      value: state.firstName,
      onChange: userSettingsActionCreators.setFirstName,
    },
    {
      label: 'last name',
      patterns: [patterns.name],
      minLength: 2,
      required: true,
      variableName: 'lastName',
      inputRef: createRef<HTMLInputElement>(),
      idPrefix,
      value: state.lastName,
      onChange: userSettingsActionCreators.setLastName,
    },
    {
      label: 'username',
      patterns: [patterns.userName],
      minLength: 4,
      required: true,
      variableName: 'username',
      inputRef: createRef(),
      idPrefix,
      value: state.username,
      onChange: userSettingsActionCreators.setUserName,
    },
    // {
    //   label: 'email',
    //   value: state.email,
    //   type: 'component',
    //   component: <div>update email</div>,
    // },
  ];
  const changePassword: ValidatedTextInputProps[] = [
    {
      inputRef: createRef(),
      variableName: 'newPassword',
      patterns: [patterns.password],
      label: 'new password',
      type: 'password',
      minLength: 8,
      required: true,
      idPrefix,
      value: state.newPassword || '',
      onChange: userSettingsActionCreators.setNewPassword,
    },
    {
      inputRef: createRef(),
      variableName: 'newPasswordConfirmation',
      patterns: [patterns.password],
      label: 'confirm new password',
      type: 'password',
      minLength: 8,
      required: true,
      idPrefix,
      value: state.newPasswordConfirmation || '',
      onChange: userSettingsActionCreators.setNewPasswordConfirmation,
    },
  ];
  useEffect(() => {
    const changes: Omit<UpdateUserProfileIt, 'currentPassword'> = {};
    let validity = true;
    const validate = ({ variableName, inputRef }) => {
      const localValue = state[variableName];
      // @ts-ignore
      validity = validity && inputRef?.current?.checkValidity();
      if (validity && localValue !== currentSettings[variableName]) {
        changes[variableName] = localValue;
      }
    };
    personalInformation.forEach(validate);
    if (
      state.newPassword &&
      state.newPassword === state.newPasswordConfirmation
    ) {
      changes.newPassword = state.newPassword;
      const newPassword = changePassword[0];
      validity =
        // @ts-ignore
        validity && newPassword.inputRef?.current?.checkValidity();
    }

    if (validity && Object.keys(changes).length) {
      ac.settings.setUserProfileChanges({ ...changes, currentPassword: '' });
    } else ac.settings.clearUserProfileChanges();
  }, [
    state.firstName,
    state.lastName,
    state.username,
    state.newPassword,
    state.newPasswordConfirmation,
  ]);
  return (
    <div className={modUserProfile}>
      <div className={modUserProfile.userProfile__personalInformation}>
        {personalInformation.map(po => (
          <ValidatedTextInput key={po.label} {...po} />
        ))}
        {changePassword.map(po => (
          <ValidatedTextInput key={po.label} {...po} />
        ))}
        <div>
          <ButtonSquare
            text={'delete account'}
            onClick={ac.auth.deleteAccount}
            variant={'danger'}
          />
        </div>
      </div>
    </div>
  );
};

const _ = connector(UserProfile);
export { _ as UserProfile };
