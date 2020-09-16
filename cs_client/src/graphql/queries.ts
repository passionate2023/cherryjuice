import gql from 'graphql-tag';
import { NodeSearchIt, NodeSearchResults } from '::types/graphql/generated';

const QUERY_DOCUMENTS = {
  currentImports: {
    query: gql`
      query {
        document {
          status
        }
      }
    `,
    path: (data): { status: string }[] => data?.document || [],
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
export { QUERY, QUERY_DOCUMENTS };
