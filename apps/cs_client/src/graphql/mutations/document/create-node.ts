import { CreateNodeIt } from '@cherryjuice/graphql-types';
import gql from 'graphql-tag';

type Variables = { file_id: string; node_id: number; meta: CreateNodeIt };
const CREATE_NODE = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document?.node?.createNode,
  query: gql`
    mutation create_node(
      $file_id: String!
      $node_id: Int!
      $meta: CreateNodeIt!
    ) {
      document(file_id: $file_id) {
        node(node_id: $node_id) {
          createNode(meta: $meta)
        }
      }
    }
  `,
});

export { CREATE_NODE };
