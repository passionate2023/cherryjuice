import gql from 'graphql-tag';

const FRAGMENT_USER = {
  userInfo: gql`
    fragment UserInfo on User {
      username
      email
      lastName
      email_verified
      firstName
      id
      picture
      hasPassword
      tokens {
        type
        id
        meta {
          currentEmail
          newEmail
        }
      }
    }
  `,
};

export const DOCUMENT_GUEST = gql`
  fragment DocumentGuest on Document {
    guests {
      userId
      accessLevel
      email
    }
  }
`;

export { FRAGMENT_USER };
