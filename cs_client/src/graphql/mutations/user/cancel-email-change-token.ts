import gql from 'graphql-tag';
import { GraphqlArgsPipe } from '::graphql/cache/apollo-cache';
import { CancelChangeEmailIt } from '::types/graphql/generated';

type Variables = {
  input: CancelChangeEmailIt;
};

const CANCEL_EMAIL_CHANGE_TOKEN: GraphqlArgsPipe<
  Variables,
  number
> = variables => ({
  variables,
  path: data => data?.user?.createEmailChangeToken,
  query: gql`
    mutation cancel_email_change_token($input: CancelChangeEmailIt!) {
      user {
        cancelEmailChangeToken(input: $input)
      }
    }
  `,
});

export { CANCEL_EMAIL_CHANGE_TOKEN };
