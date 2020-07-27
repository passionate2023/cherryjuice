import gql from 'graphql-tag';
type Variables = {
  file_id: string;
};
export const EXPORT_DOCUMENT = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document?.exportDocument,
  query: gql`
    query export_document($file_id: String!) {
      document(file_id: $file_id) {
        exportDocument
      }
    }
  `,
});
