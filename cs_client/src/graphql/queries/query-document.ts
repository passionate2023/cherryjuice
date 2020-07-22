import { NodeMeta } from '::types/graphql/adapters';
import gql from 'graphql-tag';
import { DOCUMENT_OWNER } from '::graphql/fragments';
import { DocumentOwner } from '::types/graphql/generated';

type QNodeMeta = Pick<
  NodeMeta,
  | 'id'
  | 'documentId'
  | 'node_id'
  | 'father_id'
  | 'fatherId'
  | 'name'
  | 'child_nodes'
  | 'createdAt'
  | 'updatedAt'
  | 'node_title_styles'
>;

type QDocumentMeta = {
  id: string;
  owner: DocumentOwner;
  node: QNodeMeta[];
};

const QUERY_DOCUMENT = ({ file_id }: { file_id: string }) => ({
  variables: { file_id },
  path: (data): QDocumentMeta | undefined => data?.document[0],
  query: gql`
    query node_meta($file_id: String!) {
      document(file_id: $file_id) {
        id
        ...DocumentOwner
        node {
          id
          documentId
          node_id
          father_id
          fatherId
          name
          child_nodes
          createdAt
          updatedAt
          node_title_styles
        }
      }
    }
    ${DOCUMENT_OWNER}
  `,
});

export { QUERY_DOCUMENT };
export { QNodeMeta, QDocumentMeta };
