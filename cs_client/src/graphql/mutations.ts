import gql from 'graphql-tag';

const MUTATE_CT_NODE_CONTENT = {
  html: gql`
    mutation ct_node_html(
      $file_id: String!
      $node_id: Int!
      $abstract_html: String!
    ) {
      ct_node_content(
        file_id: $file_id
        node_id: $node_id
        abstract_html: $abstract_html
      )
    }
  `
};
export { MUTATE_CT_NODE_CONTENT };
