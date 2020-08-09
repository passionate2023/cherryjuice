import gql from 'graphql-tag';
import { VerifyEmailIt } from '::types/graphql/generated';

type Variables = {
  input: VerifyEmailIt;
};

const CHANGE_EMAIL = (variables: Variables) => ({
  variables,
  path: (data): number => data?.user?.changeEmail,
  query: gql`
    mutation change_email($input: ConfirmEmailChangeIt!) {
      user {
        changeEmail(input: $input)
      }
    }
  `,
});

export { CHANGE_EMAIL };
