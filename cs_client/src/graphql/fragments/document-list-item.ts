import { Document } from '::types/graphql/generated';
import gql from 'graphql-tag';
import { DOCUMENT_GUEST } from '::graphql/fragments';

export type QDocumentsListItem = Pick<
  Document,
  | 'id'
  | 'userId'
  | 'name'
  | 'folder'
  | 'size'
  | 'hash'
  | 'createdAt'
  | 'updatedAt'
  | 'guests'
  | 'privacy'
  | 'state'
>;

export const DOCUMENT_LIST_ITEM = gql`
  fragment DocumentListItem on Document {
    id
    userId
    name
    folder
    size
    hash
    createdAt
    updatedAt
    privacy
    state {
      updatedAt
      recentNodes
      scrollPositions {
        node_id
        x
        y
      }
      selectedNode_id
      treeState
    }
    ...DocumentGuest
  }
  ${DOCUMENT_GUEST}
`;
