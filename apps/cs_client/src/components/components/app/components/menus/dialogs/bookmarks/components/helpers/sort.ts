import { CachedDocument, QFullNode } from '::store/ducks/cache/document-cache';
import { SortNodesBy } from '@cherryjuice/graphql-types';

export type PartialNode = Pick<QFullNode, 'name' | 'createdAt' | 'updatedAt'>;
const sortByNodeName = (xs: PartialNode[]) =>
  xs.sort((a, b) => a.name.localeCompare(b.name));
const sortByNodeUpdated = (xs: PartialNode[]): PartialNode[] =>
  xs.sort((a, b) => a.updatedAt - b.updatedAt);
const sortByNodeCreated = (xs: PartialNode[]): PartialNode[] =>
  xs.sort((a, b) => a.createdAt - b.createdAt);

const sortByDocumentName = (xs: CachedDocument[]) =>
  xs.sort((a, b) => a.name.localeCompare(b.name));
const sortByDocumentUpdated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.localState.localUpdatedAt - b.localState.localUpdatedAt);
const sortByDocumentCreated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.createdAt - b.createdAt);

export const mapSortNodesBy = {
  [SortNodesBy.CreatedAt]: sortByNodeCreated,
  [SortNodesBy.UpdatedAt]: sortByNodeUpdated,
  [SortNodesBy.DocumentName]: sortByNodeName,
  [SortNodesBy.NodeName]: sortByNodeName,
};

export const mapSortDocumentBy = {
  [SortNodesBy.CreatedAt]: sortByDocumentCreated,
  [SortNodesBy.UpdatedAt]: sortByDocumentUpdated,
  [SortNodesBy.DocumentName]: sortByDocumentName,
};
