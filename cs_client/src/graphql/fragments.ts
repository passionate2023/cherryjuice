import gql from 'graphql-tag';

const FRAGMENT_USER = {
  userInfo: gql`
    fragment UserInfo on User {
      username
      email
      lastName
      firstName
      id
      picture
    }
  `,
};

export { FRAGMENT_USER };
