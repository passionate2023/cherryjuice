import gql from 'graphql-tag';
import { NodeMeta } from '::types/graphql-adapters';

export type QNodeMeta = Pick<
  NodeMeta,
  | 'id'
  | 'documentId'
  | 'node_id'
  | 'father_id'
  | 'fatherId'
  | 'name'
  | 'child_nodes'
  | 'createdAt'
  | 'updatedAt'
  | 'node_title_styles'
  | 'read_only'
  | 'privacy'
>;

export const NODE_META = gql`
  fragment NodeMeta on Node {
    id
    documentId
    node_id
    father_id
    fatherId
    name
    child_nodes
    createdAt
    updatedAt
    node_title_styles
    privacy
    read_only
  }
`;
