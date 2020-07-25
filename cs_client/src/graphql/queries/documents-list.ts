import gql from 'graphql-tag';
import { DOCUMENT_GUEST } from '::graphql/fragments';
import { Document } from '::types/graphql/generated';

export type QDocumentsListItem = Pick<
  Document,
  | 'id'
  | 'name'
  | 'size'
  | 'hash'
  | 'createdAt'
  | 'updatedAt'
  | 'folder'
  | 'guests'
  | 'privacy'
>;

export const DOCUMENTS_LIST = () => ({
  variables: undefined,
  path: (data): QDocumentsListItem[] => data?.document || [],
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
        privacy
        ...DocumentGuest
      }
    }
    ${DOCUMENT_GUEST}
  `,
});
