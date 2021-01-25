import { Document } from '@cherryjuice/graphql-types';
import gql from 'graphql-tag';
import { DOCUMENT_GUEST } from '::graphql/fragments';

export type QDocumentsListItem = Pick<
  Document,
  | 'id'
  | 'userId'
  | 'name'
  | 'folderId'
  | 'size'
  | 'hash'
  | 'createdAt'
  | 'updatedAt'
  | 'guests'
  | 'privacy'
  | 'privateNodes'
  | 'state'
>;

export const DOCUMENT_LIST_ITEM = gql`
  fragment DocumentListItem on Document {
    id
    userId
    name
    folderId
    size
    hash
    createdAt
    updatedAt
    privacy
    privateNodes {
      father_id
      node_id
    }
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
      lastOpenedAt
      bookmarks
    }
    ...DocumentGuest
  }
  ${DOCUMENT_GUEST}
`;
