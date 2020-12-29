import gql from 'graphql-tag';
import { DocumentOperation } from '@cherryjuice/graphql-types';

type Args = { userId: string };

const DOCUMENT_OPERATION = ({ userId }: Args) => ({
  variables: { userId },
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
});

export { DOCUMENT_OPERATION };
