import gql from 'graphql-tag';
type Variables = {
  file_id: string;
};
export const CLONE_DOCUMENT = (variables: Variables) => ({
  variables,
  path: (): void => undefined,
  query: gql`
    mutation clone_document($file_id: String!) {
      document(file_id: $file_id) {
        clone
      }
    }
  `,
});
