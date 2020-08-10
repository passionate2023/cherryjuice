import gql from 'graphql-tag';
import { GraphqlArgsPipe } from '::graphql/cache/apollo-cache';

const CREATE_EMAIL_VERIFICATION_TOKEN: GraphqlArgsPipe<
  undefined,
  number
> = () => ({
  variables: undefined,
  path: (data) => data?.user?.createPasswordResetToken,
  query: gql`
    mutation create_email_verification_token {
      user {
        createEmailVerificationToken
      }
    }
  `,
});

export { CREATE_EMAIL_VERIFICATION_TOKEN };
