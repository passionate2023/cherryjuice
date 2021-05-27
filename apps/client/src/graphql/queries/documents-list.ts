import gql from 'graphql-tag';
import {
  DOCUMENT_LIST_ITEM,
  QDocumentsListItem,
} from '::graphql/fragments/document-list-item';

export const DOCUMENTS_LIST = () => ({
  variables: undefined,
  path: (data): QDocumentsListItem[] => data?.document || [],
  query: gql`
    query documents_meta($file_id: String) {
      document(file_id: $file_id) {
        ...DocumentListItem
      }
    }
    ${DOCUMENT_LIST_ITEM}
  `,
});
