import gql from 'graphql-tag';
import { AuthUser, UpdateUserProfileIt } from '::types/graphql/generated';
import { FRAGMENT_USER } from '::graphql/fragments';

type Variables = {
  userProfile: UpdateUserProfileIt;
};
export const UPDATE_USER_PROFILE = (variables: Variables) => ({
  variables,
  path: (data): AuthUser => data?.user?.updateUserProfile,
  query: gql`
    mutation update_user_information($userProfile: UpdateUserProfileIt!) {
      user {
        updateUserProfile(userProfile: $userProfile) {
          token
          user {
            ...UserInfo
          }
          secrets {
            google_api_key
            google_client_id
          }
        }
      }
    }
    ${FRAGMENT_USER.userInfo}
  `,
});
