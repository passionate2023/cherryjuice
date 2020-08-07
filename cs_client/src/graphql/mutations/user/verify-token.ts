import gql from 'graphql-tag';

type Variables = { token: string };
const VERIFY_TOKEN = (variables: Variables) => ({
  variables,
  path: (data): number => data?.user?.verifyToken,
  query: gql`
    query verify_token($token: String!) {
      user {
        verifyTokenValidity(token: $token)
      }
    }
  `,
});

export { VERIFY_TOKEN };
