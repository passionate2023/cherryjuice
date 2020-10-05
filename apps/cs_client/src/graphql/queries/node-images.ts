import { Image } from '@cherryjuice/graphql-types';
import gql from 'graphql-tag';

type Variables = {
  node_ids: number[];
  file_id: string;
  thumbnail?: boolean;
};

export const FETCH_NODE_IMAGES = (variables: Variables) => ({
  variables,
  path: (data): { node_id: number; image: Image[]; id: string }[] =>
    data?.document[0]?.node,
  query: gql`
    query node_content__png(
      $file_id: String!
      $node_ids: [Int]
      $thumbnail: Boolean
    ) {
      document(file_id: $file_id) {
        id
        node(node_ids: $node_ids) {
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
