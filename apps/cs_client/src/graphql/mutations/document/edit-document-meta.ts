import gql from 'graphql-tag';
import { EditDocumentIt } from '@cherryjuice/graphql-types';

type Variables = {
  file_id: string;
  meta: EditDocumentIt;
};
export const EDIT_DOCUMENT_META = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document?.editDocument,
  query: gql`
    mutation editDocument($file_id: String!, $meta: EditDocumentIt!) {
      document(file_id: $file_id) {
        editDocument(meta: $meta)
      }
    }
  `,
});
