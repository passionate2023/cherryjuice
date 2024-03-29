import gql from 'graphql-tag';
import { CreateDocumentIt } from '@cherryjuice/graphql-types';

type Variables = {
  document: CreateDocumentIt;
};
const CREATE_DOCUMENT = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document?.createDocument,
  query: gql`
    mutation create_document($document: CreateDocumentIt!) {
      document {
        createDocument(document: $document)
      }
    }
  `,
});

export { CREATE_DOCUMENT };
