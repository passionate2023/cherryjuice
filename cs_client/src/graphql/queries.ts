import gql from 'graphql-tag';
import {
  DOCUMENT_SUBSCRIPTIONS as DS,
  Image,
  NodeSearchIt,
  NodeSearchResults,
} from '::types/graphql/generated';
import { NodeHtml } from '::types/graphql-adapters';

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
  currentImports: {
    query: gql`
      query {
        document {
          id
          status
          name
          hash
        }
      }
    `,
    path: (data): { id: string; status: DS; name: string; hash: string }[] =>
      data?.document || [],
  },
};

const QUERY_SEARCH = {
  searchNode: {
    path: (data): NodeSearchResults => data?.search.node,
    args: (args: { args: NodeSearchIt }): { args: NodeSearchIt } => args,
    query: gql`
      query searchNode($args: NodeSearchIt) {
        search {
          node(searchArgs: $args) {
            meta {
              elapsedTimeMs
              timestamp
            }
            results {
              documentId
              nodeId
              node_id
              nodeName
              documentName
              ahtmlHeadline
              nodeNameHeadline
              ahtml_txt
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
  },
};
const QUERY = {
  SEARCH: QUERY_SEARCH,
};
export { QUERY, QUERY_DOCUMENTS, QUERY_NODE_CONTENT };
