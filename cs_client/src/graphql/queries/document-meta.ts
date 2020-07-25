import { NodeMeta } from '::types/graphql-adapters';
import gql from 'graphql-tag';
import { DOCUMENT_GUEST } from '::graphql/fragments';
import { Document } from '::types/graphql/generated';

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
  | 'privacy'
>;

type QDocumentMeta = Pick<
  Document,
  'id' | 'name' | 'folder' | 'guests' | 'privacy' | 'userId'
> & {
  node: QNodeMeta[];
};

type Args = { file_id: string };
const DOCUMENT_META = ({ file_id }: Args) => ({
  variables: { file_id },
  path: (data): QDocumentMeta | undefined => data?.document[0],
  query: gql`
    query document_meta($file_id: String!) {
      document(file_id: $file_id) {
        id
        name
        folder
        privacy
        userId
        ...DocumentGuest
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
          privacy
        }
      }
    }
    ${DOCUMENT_GUEST}
  `,
});

export { DOCUMENT_META };
export { QNodeMeta, QDocumentMeta };
