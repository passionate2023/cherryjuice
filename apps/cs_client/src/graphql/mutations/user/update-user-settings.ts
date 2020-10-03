import gql from 'graphql-tag';
import { AuthUser, UpdateUserSettingsIt } from '::types/graphql';
import { FRAGMENT_AUTH_USER } from '::graphql/fragments';

type Variables = {
  input: UpdateUserSettingsIt;
};

export const UPDATE_USER_SETTINGS = (variables: Variables) => ({
  variables,
  path: (data): AuthUser => data?.user?.updateUserSettings,
  query: gql`
    mutation update_user_settings($input: UpdateUserSettingsIt!) {
      user {
        updateUserSettings(userSettings: $input) {
          ...AuthUser
        }
      }
    }
    ${FRAGMENT_AUTH_USER.authUser}
  `,
});
