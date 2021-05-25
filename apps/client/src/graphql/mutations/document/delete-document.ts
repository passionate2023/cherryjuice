import gql from 'graphql-tag';

type Variables = {
  documents: { IDs: string[] };
};
const DELETE_DOCUMENT = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document.deleteDocument,
  query: gql`
    mutation delete_document($documents: DeleteDocumentInputType!) {
      document {
        deleteDocument(documents: $documents)
      }
    }
  `,
});

export { DELETE_DOCUMENT };
