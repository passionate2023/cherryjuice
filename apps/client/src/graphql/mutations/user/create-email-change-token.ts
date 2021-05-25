import gql from 'graphql-tag';
import { GraphqlArgsPipe } from '../../client/apollo-client';
import { ChangeEmailIt } from '@cherryjuice/graphql-types';

type Variables = {
  input: ChangeEmailIt;
};

const CREATE_EMAIL_CHANGE_TOKEN: GraphqlArgsPipe<
  Variables,
  number
> = variables => ({
  variables,
  path: data => data?.user?.createEmailChangeToken,
  query: gql`
    mutation create_email_change_token($input: ChangeEmailIt!) {
      user {
        createEmailChangeToken(input: $input)
      }
    }
  `,
});

export { CREATE_EMAIL_CHANGE_TOKEN };
