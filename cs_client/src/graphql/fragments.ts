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

const FRAGMENT_AUTH_USER = {
  authUser: gql`
    fragment AuthUser on AuthUser {
      token
      user {
        ...UserInfo
      }
      secrets {
        google_api_key
        google_client_id
      }
      settings {
        hotKeys {
          formatting {
            keys
            type
          }
          general {
            keys
            type
          }
        }
      }
    }
    ${FRAGMENT_USER.userInfo}
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

export { FRAGMENT_USER, FRAGMENT_AUTH_USER };
