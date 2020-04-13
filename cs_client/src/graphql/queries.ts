import gql from 'graphql-tag';

const QUERY_CT_NODE_META = gql`
  query node_meta($file_id: String!) {
    document(file_id: $file_id) {
      node_meta {
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
  }
`;

const QUERY_CT_NODE_CONTENT = {
  png: gql`
    query node_content__png($file_id: String!, $node_id: Int!, $offset: Int!) {
      document(file_id: $file_id) {
        node_content(node_id: $node_id) {
          png(offset: $offset)
          node_id
        }
      }
    }
  `,
  png_thumbnail: gql`
    query node_content__png_thumb(
      $file_id: String!
      $node_id: Int!
      $offset: Int!
    ) {
      document(file_id: $file_id) {
        node_content(node_id: $node_id) {
          png_thumbnail(offset: $offset)
          node_id
        }
      }
    }
  `,
  html: gql`
    query node_content__html($file_id: String!, $node_id: Int!) {
      document(file_id: $file_id) {
        node_content(node_id: $node_id) {
          html
          node_id
        }
      }
    }
  `,
  all_png: gql`
    query node_content__all_png($file_id: String!, $node_id: Int!) {
      document(file_id: $file_id) {
        node_content(node_id: $node_id) {
          png
          node_id
        }
      }
    }
  `,
  all_png_thumbnail: gql`
      query node_content__all_png_thumb(
      $file_id: String!
      $node_id: Int!
    ) {
      document(file_id: $file_id) {
        node_content(node_id: $node_id) {
          png_thumbnail
          node_id
        }
      }
    }
  `,
};

const QUERY_CT_FILES = gql`
  query documents_meta($file_id: String) {
    document(file_id: $file_id) {
      document_meta {
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
  }
`;
export { QUERY_CT_FILES, QUERY_CT_NODE_META, QUERY_CT_NODE_CONTENT };
