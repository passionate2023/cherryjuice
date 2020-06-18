import gql from 'graphql-tag';
import {
  AuthUser,
  DOCUMENT_SUBSCRIPTIONS,
  Image,
  Secrets,
} from '::types/graphql/generated';
import { FRAGMENT_USER } from '::graphql/fragments';
import { NodeHtml, NodeMeta, DocumentMeta } from '::types/graphql/adapters';

const QUERY_NODE_META = {
  path: (data): NodeMeta[] | undefined => data?.document[0]?.node,
  query: gql`
    query node_meta($file_id: String!) {
      document(file_id: $file_id) {
        id
        node {
          id
          documentId
          node_id
          father_id
          fatherId
          name
          child_nodes
          is_empty
          is_richtxt
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
  },
  html: {
    path: (data): NodeHtml => data?.document[0]?.node[0],
    query: gql`
      query node_content__html($file_id: String!, $node_id: Int!) {
        document(file_id: $file_id) {
          id
          node(node_id: $node_id) {
            id
            html
            node_id
          }
        }
      }
    `,
  },
};

const QUERY_DOCUMENTS = {
  documentMeta: {
    path: (data): DocumentMeta[] => data?.document || [],
    query: gql`
      query documents_meta($file_id: String) {
        document(file_id: $file_id) {
          id
          name
          size
          hash
          createdAt
          updatedAt
          folder
        }
      }
    `,
  },
  currentImports: {
    query: gql`
      query {
        document {
          id
          status
          name
        }
      }
    `,
    path: (
      data,
    ): { id: string; status: DOCUMENT_SUBSCRIPTIONS; name: string }[] =>
      data?.document || [],
  },
};

const QUERY_USER = {
  path: (data): { session: AuthUser; secrets: Secrets } => data,
  query: gql`
    query user {
      session: user {
        user {
          ...UserInfo
        }
        token
      }
      secrets {
        google_api_key
        google_client_id
      }
    }
    ${FRAGMENT_USER.userInfo}
  `,
};
export { QUERY_DOCUMENTS, QUERY_NODE_META, QUERY_NODE_CONTENT, QUERY_USER };
