import gql from 'graphql-tag';
import { NODE_META, QNodeMeta } from '::graphql/fragments/node-meta';
import {
  DOCUMENT_LIST_ITEM,
  QDocumentsListItem,
} from '::graphql/fragments/document-list-item';
type QDocumentMeta = QDocumentsListItem & {
  node: QNodeMeta[];
};

type Args = { file_id: string };
const DOCUMENT_META = ({ file_id }: Args) => ({
  variables: { file_id },
  path: (data): QDocumentMeta | undefined => data?.document[0],
  query: gql`
    query document_meta($file_id: String!) {
      document(file_id: $file_id) {
        ...DocumentListItem
        node {
          ...NodeMeta
        }
      }
    }
    ${DOCUMENT_LIST_ITEM}
    ${NODE_META}
  `,
});

export { DOCUMENT_META };
export { QNodeMeta, QDocumentMeta };
