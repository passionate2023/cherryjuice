import gql from 'graphql-tag';
import { AuthUser, UpdateUserProfileIt } from '::types/graphql';
import { FRAGMENT_AUTH_USER } from '::graphql/fragments';

type Variables = {
  userProfile: UpdateUserProfileIt;
};
export const UPDATE_USER_PROFILE = (variables: Variables) => ({
  variables,
  path: (data): AuthUser => data?.user?.updateUserProfile,
  query: gql`
    mutation update_user_profile($userProfile: UpdateUserProfileIt!) {
      user {
        updateUserProfile(userProfile: $userProfile) {
          ...AuthUser
        }
      }
    }
    ${FRAGMENT_AUTH_USER.authUser}
  `,
});
