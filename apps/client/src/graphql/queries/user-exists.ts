import gql from 'graphql-tag';

type Variables = { email: string };
const USER_EXISTS = (variables: Variables) => ({
  variables,
  path: (data): string => data?.user?.userExists,
  query: gql`
    query user_exists($email: String!) {
      user {
        userExists(email: $email)
      }
    }
  `,
});

export { USER_EXISTS };
