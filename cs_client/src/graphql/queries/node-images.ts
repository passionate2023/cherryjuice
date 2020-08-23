import { Image } from '::types/graphql/generated';
import gql from 'graphql-tag';

type Variables = {
  node_id: number;
  file_id: string;
  thumbnail?: boolean;
};

export const FETCH_NODE_IMAGES = (variables: Variables) => ({
  variables,
  path: (data): { node_id: number; image: Image[]; id: string } | undefined =>
    data?.document[0]?.node[0],
  query: gql`
    query node_content__png(
      $file_id: String!
      $node_id: Int!
      $thumbnail: Boolean
    ) {
      document(file_id: $file_id) {
        id
        node(node_id: $node_id) {
          id
          node_id
          image(thumbnail: $thumbnail) {
            base64
            id
          }
        }
      }
    }
  `,
});
