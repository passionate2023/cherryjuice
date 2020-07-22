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

export const DOCUMENT_OWNER = gql`
  fragment DocumentOwner on Document {
    owner {
      public
      userId
      ownershipLevel
    }
  }
`;

export { FRAGMENT_USER };
