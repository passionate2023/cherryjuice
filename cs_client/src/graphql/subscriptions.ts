import gql from 'graphql-tag';
import { DocumentOperation } from '::types/graphql';

const DOCUMENT_OPERATION = {
  path: (data): DocumentOperation => data?.documentOperation,
  query: gql`
    subscription DOCUMENT_OPERATION($userId: String!) {
      documentOperation(userId: $userId) {
        context
        progress
        state
        target {
          hash
          id
          name
        }
        type
        userId
      }
    }
  `,
};

export { DOCUMENT_OPERATION };
