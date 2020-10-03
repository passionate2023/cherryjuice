import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';

import {
  primitiveStateToValidatedState,
  userSettingsActionCreators,
  userSettingsReducer,
} from '::root/components/app/components/menus/dialogs/settings/screens/account/reducer/reducer';
import { useEffect, useReducer } from 'react';
import { UpdateUserProfileIt } from '@cherryjuice/graphql-types';
import { Email } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/email/email';
import { Profile } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/profile/profile';
import { Password } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/password/password';
import { ManageAccount } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/manage-account/manage-account';
import { SettingsGroupContainer } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group-container';

const mapState = (state: Store) => ({
  currentSettings: {
    firstName: state.auth.user?.firstName,
    lastName: state.auth.user?.lastName,
    email: state.auth.user?.email,
    username: state.auth.user?.username,
  },
  emailVerified: state.auth.user?.email_verified,
  token: state.auth?.token,
  tokens: state.auth.user?.tokens,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const UserProfile: React.FC<Props & PropsFromRedux> = ({
  currentSettings,
  token,
  emailVerified,
  tokens,
}) => {
  const [state, dispatch] = useReducer(userSettingsReducer, {
    ...primitiveStateToValidatedState(currentSettings),
    newPassword: { value: '', valid: false },
    newPasswordConfirmation: { value: '', valid: false },
  });
  useEffect(() => {
    userSettingsActionCreators.init(dispatch);
  }, []);

  useEffect(() => {
    userSettingsActionCreators.reset(currentSettings);
  }, [token]);

  useEffect(() => {
    const changes: Omit<UpdateUserProfileIt, 'currentPassword'> = {};
    let validity = true;
    const validate = (variableName: string) => {
      const localValue = state[variableName].value;
      validity = validity && state[variableName].valid;

      if (validity && localValue !== currentSettings[variableName]) {
        changes[variableName] = localValue;
      }
    };

    ['firstName', 'lastName', 'username', 'email'].forEach(validate);
    if (
      state.newPassword.value &&
      state.newPassword.value === state.newPasswordConfirmation.value
    ) {
      changes.newPassword = state.newPassword.value;
      validity = validity && state.newPassword.valid;
    }

    if (validity && Object.keys(changes).length) {
      ac.settings.setUserProfileChanges({ ...changes, currentPassword: '' });
    } else ac.settings.clearUserProfileChanges();
  }, [
    state.firstName,
    state.lastName,
    state.username,
    state.email,
    state.newPassword,
    state.newPasswordConfirmation,
  ]);
  return (
    <SettingsGroupContainer>
      {tokens && (
        <>
          <Profile
            firstName={state.firstName}
            lastName={state.lastName}
            username={state.username}
          />
          <Email
            currentEmail={currentSettings.email}
            email={state.email}
            emailVerified={emailVerified}
            tokens={tokens}
          />
          <Password
            newPassword={state.newPassword}
            newPasswordConfirmation={state.newPasswordConfirmation}
          />
          <ManageAccount />
        </>
      )}
    </SettingsGroupContainer>
  );
};

const _ = connector(UserProfile);
export { _ as UserProfile };
