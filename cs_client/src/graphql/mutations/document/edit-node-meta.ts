import gql from 'graphql-tag';
import { NodeMetaIt } from '::types/graphql';

type Variables = {
  file_id: string;
  meta: NodeMetaIt[];
};
const EDIT_NODE_META = (variables: Variables) => ({
  variables,
  path: (data): string[] => data?.document?.node?.editMeta,
  query: gql`
    mutation edit_node_meta($file_id: String!, $meta: [NodeMetaIt!]!) {
      document(file_id: $file_id) {
        node {
          editMeta(meta: $meta)
        }
      }
    }
  `,
});

export { EDIT_NODE_META };
