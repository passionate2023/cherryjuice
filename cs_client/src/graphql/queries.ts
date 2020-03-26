import gql from 'graphql-tag';

const QUERY_CT_NODE_META = gql`
  query ct_node_meta($file_id: String!) {
    ct_node_meta(file_id: $file_id) {
      node_id
      father_id
      name
      child_nodes
      is_empty
      is_richtxt
      has_image
      has_codebox
      has_table
      ts_creation
      ts_lastsave
      node_title_styles
      icon_id
    }
  }
`;

const QUERY_CT_NODE_CONTENT = {
  // rich_txt: gql`
  //   query ct_node_rt_png_meta(
  //     $file_id: String!
  //     $node_id: Int!
  //   ) {
  //     ct_node_content(file_id: $file_id, node_id: $node_id) {
  //       rich_txt
  //       node_id
  //     }
  //   }
  // `,
  png_full_base64: gql`
    query ct_node_rt_png_meta(
      $file_id: String!
      $node_id: Int!
      $offset: Int!
    ) {
      ct_node_content(file_id: $file_id, node_id: $node_id) {
        png_full_base64(offset: $offset)
        node_id
      }
    }
  `,
  png_thumbnail_base64: gql`
    query ct_node_rt_png_meta(
      $file_id: String!
      $node_id: Int!
      $offset: Int!
    ) {
      ct_node_content(file_id: $file_id, node_id: $node_id) {
        png_thumbnail_base64(offset: $offset)
        node_id
        node_id
      }
    }
  `,
  html: gql`
    query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {
      ct_node_content(file_id: $file_id, node_id: $node_id) {
        html
        node_id
      }
    }
  `,
  all_png_full_base64: gql`
    query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {
      ct_node_content(file_id: $file_id, node_id: $node_id) {
        all_png_full_base64
        node_id
      }
    }
  `,
  all_png_thumbnail_base64: gql`
    query ct_node_rt_png_meta($file_id: String!, $node_id: Int!) {
      ct_node_content(file_id: $file_id, node_id: $node_id) {
        all_png_thumbnail_base64
        node_id
      }
    }
  `,
};

const QUERY_CT_FILES = gql`
  query ct_files($file_id: String) {
    ct_files(file_id: $file_id) {
      name
      size
      fileCreation
      fileContentModification
      fileAccess
      slug
      id
      filePath
      fileFolder
    }
  }
`;
export { QUERY_CT_FILES, QUERY_CT_NODE_META, QUERY_CT_NODE_CONTENT };
