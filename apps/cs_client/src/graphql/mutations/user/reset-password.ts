import gql from 'graphql-tag';
import { ResetPasswordIt } from '::types/graphql';

type Variables = { input: ResetPasswordIt };
const RESET_PASSWORD = (variables: Variables) => ({
  variables,
  path: (data): number => data?.user?.resetPassword,
  query: gql`
    mutation reset_password($input: ResetPasswordIt!) {
      user {
        resetPassword(input: $input)
      }
    }
  `,
});

export { RESET_PASSWORD };
