import gql from 'graphql-tag';
import { Node } from '::types/graphql/generated';
export type NodeHtml = Pick<Node, 'html' | 'node_id' | 'id' | 'updatedAt'>;

type Variables = { file_id: string; node_id: number };
const NODE_HTML = (variables: Variables) => ({
  variables,
  path: (data): NodeHtml => data?.document[0]?.node[0],
  query: gql`
    query node_html($file_id: String!, $node_id: Int!) {
      document(file_id: $file_id) {
        id
        node(node_id: $node_id) {
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
