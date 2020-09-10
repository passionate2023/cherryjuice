import gql from 'graphql-tag';
import { DocumentStateIt } from '::types/graphql/generated';

type Variables = {
  file_id: string;
  state: DocumentStateIt;
};

export const SET_DOCUMENT_STATE = (variables: Variables) => ({
  variables,
  path: (data): string => data?.document?.editDocument,
  query: gql`
    mutation set_document_state($file_id: String!, $state: DocumentStateIt!) {
      document(file_id: $file_id) {
        setState(state: $state)
      }
    }
  `,
});
