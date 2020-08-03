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

const mapState = (state: Store) => ({
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

const UserProfile: React.FC<Props & PropsFromRedux> = ({ currentSettings }) => {
  const [state, dispatch] = useReducer(userSettingsReducer, currentSettings);
  useEffect(() => {
    userSettingsActionCreators.__setDispatch(dispatch);
  }, []);

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
    // {
    //   label: 'user name',
    //   value: state.username,
    //   type: 'component',
    //   component: <div>update username</div>,
    // },
    // {
    //   label: 'email',
    //   value: state.email,
    //   type: 'component',
    //   component: <div>update email</div>,
    // },
    // {
    //   label: 'password',
    //   value: '',
    //   type: 'component',
    //   component: <div>update password</div>,
    // },
  ];
  useEffect(() => {
    const changes: UpdateUserProfileIt = {};
    let validity = true;
    personalInformation.forEach(({ variableName, inputRef }) => {
      const localValue = state[variableName];
      // @ts-ignore
      validity = validity && inputRef?.current?.checkValidity();
      if (validity && localValue !== currentSettings[variableName]) {
        changes[variableName] = localValue;
      }
    });
    if (validity && Object.keys(changes).length) {
      ac.settings.setUserProfileChanges(changes);
    } else ac.settings.clearUserProfileChanges();
  }, [state.firstName, state.lastName]);
  return (
    <div className={modUserProfile}>
      <div className={modUserProfile.userProfile__personalInformation}>
        {personalInformation.map(po => (
          <ValidatedTextInput key={po.label} {...po} />
        ))}
      </div>
    </div>
  );
};

const _ = connector(UserProfile);
export { _ as UserProfile };
