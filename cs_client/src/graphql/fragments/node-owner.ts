import gql from 'graphql-tag';

export const NODE_OWNER = gql`
  fragment NodeOwner on Node {
    owner {
      public
      userId
      ownershipLevel
    }
  }
`;
