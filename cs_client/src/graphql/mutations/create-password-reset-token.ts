import gql from 'graphql-tag';

type Variables = { email: string; username: string };
const CREATE_PASSWORD_RESET_TOKEN = (variables: Variables) => ({
  variables,
  path: (data): number => data?.user?.createPasswordResetToken,
  query: gql`
    mutation create_password_reset_token($email: String!, $username: String!) {
      user {
        createPasswordResetToken(email: $email, username: $username)
      }
    }
  `,
});

export { CREATE_PASSWORD_RESET_TOKEN };
