import { NodeMeta } from '::types/graphql/adapters';
import gql from 'graphql-tag';
import { DOCUMENT_OWNER } from '::graphql/fragments';
import { Document } from '::types/graphql/generated';
import { NODE_OWNER } from '::graphql/fragments/node-owner';

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
  | 'owner'
>;

type QDocumentMeta = Pick<Document, 'id' | 'name' | 'folder' | 'owner'> & {
  node: QNodeMeta[];
};

const QUERY_DOCUMENT = ({ file_id }: { file_id: string }) => ({
  variables: { file_id },
  path: (data): QDocumentMeta | undefined => data?.document[0],
  query: gql`
    query document_meta($file_id: String!) {
      document(file_id: $file_id) {
        id
        name
        folder
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
          ...NodeOwner
        }
      }
    }
    ${DOCUMENT_OWNER}
    ${NODE_OWNER}
  `,
});

export { QUERY_DOCUMENT };
export { QNodeMeta, QDocumentMeta };
