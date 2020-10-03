import gql from 'graphql-tag';
import { VerifyEmailIt } from '::types/graphql';

type Variables = {
  input: VerifyEmailIt;
};

const VERIFY_EMAIL = (variables: Variables) => ({
  variables,
  path: (data): number => data?.user?.createPasswordResetToken,
  query: gql`
    mutation verify_email($input: VerifyEmailIt!) {
      user {
        verifyEmail(input: $input)
      }
    }
  `,
});

export { VERIFY_EMAIL };
