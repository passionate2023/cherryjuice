import gql from 'graphql-tag';

const CREATE_EMAIL_VERIFICATION_TOKEN = () => ({
  variables: undefined,
  path: (data): number => data?.user?.createPasswordResetToken,
  query: gql`
    mutation create_email_verification_token {
      user {
        createEmailVerificationToken
      }
    }
  `,
});

export { CREATE_EMAIL_VERIFICATION_TOKEN };
