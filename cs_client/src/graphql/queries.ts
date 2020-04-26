import gql from 'graphql-tag';
import { NodeMeta, DocumentMeta, NodeImage, Node } from '::types/generated';
import { AuthUser } from '::types/graphql/generated';
const QUERY_NODE_META = {
  path: (data): NodeMeta[] | undefined => data?.document[0]?.node,
  query: gql`
    query node_meta($file_id: String!) {
      document(file_id: $file_id) {
        node {
          node_id
          father_id
          name
          child_nodes
          is_empty
          is_richtxt
          has_image
          has_codebox
          has_table
          createdAt
          updatedAt
          node_title_styles
          icon_id
        }
      }
    }
  `,
};

const QUERY_NODE_CONTENT = {
  png: {
    path: (data): NodeImage | undefined => data?.document[0]?.node[0],
    query: gql`
      query node_content__png(
        $file_id: String!
        $node_id: Int!
        $offset: Int
        $thumbnail: Boolean
      ) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            node_id
            image(offset: $offset, thumbnail: $thumbnail)
          }
        }
      }
    `,
  },
  html: {
    path: (data): Pick<Node, 'html' | 'node_id'> => data?.document[0]?.node[0],
    query: gql`
      query node_content__html($file_id: String!, $node_id: Int!) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            html
            node_id
          }
        }
      }
    `,
  },
};

const QUERY_DOCUMENTS = {
  path: (data): DocumentMeta[] => data.document,
  query: gql`
    query documents_meta($file_id: String) {
      document(file_id: $file_id) {
        id
        name
        size
        size
        createdAt
        updatedAt
        folder
      }
    }
  `,
};

const QUERY_USER = {
  path: (data): AuthUser => data.user,
  query: gql`
    query user {
      user {
        user {
          username
          email
          lastName
          firstName
          id
        }
        token
      }
    }
  `,
};
export { QUERY_DOCUMENTS, QUERY_NODE_META, QUERY_NODE_CONTENT, QUERY_USER };
