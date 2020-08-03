import gql from 'graphql-tag';
import { UpdateUserProfileIt } from '::types/graphql/generated';

type Variables = {
  userProfile: UpdateUserProfileIt;
};
export const UPDATE_USER_PROFILE = (variables: Variables) => ({
  variables,
  path: (data): string => data?.user?.updateUserProfile,
  query: gql`
    mutation update_user_information($userProfile: UpdateUserProfileIt!) {
      user {
        updateUserProfile(userProfile: $userProfile)
      }
    }
  `,
});
