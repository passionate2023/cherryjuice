import gql from 'graphql-tag';
import { DocumentSubscription } from '::types/graphql/generated';

const SUBSCRIPTION_DOCUMENT = {
  path: (data): DocumentSubscription => data?.document,
  query: gql`
    subscription documentImportPreparing($userId: String!) {
      document(userId: $userId) {
        eventType
        documentId
        documentName
      }
    }
  `,
};

export { SUBSCRIPTION_DOCUMENT };