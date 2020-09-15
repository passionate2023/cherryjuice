import gql from 'graphql-tag';
import { Node } from '::types/graphql/generated';
export type NodeHtml = Pick<Node, 'html' | 'node_id' | 'id' | 'updatedAt'>;

type Variables = { file_id: string; node_ids: number[] };
const NODE_HTML = (variables: Variables) => ({
  variables,
  path: (data): NodeHtml[] => data?.document[0]?.node,
  query: gql`
    query node_html($file_id: String!, $node_ids: [Int]) {
      document(file_id: $file_id) {
        id
        node(node_ids: $node_ids) {
          id
          html
          node_id
          updatedAt
        }
      }
    }
  `,
});

export { NODE_HTML };
