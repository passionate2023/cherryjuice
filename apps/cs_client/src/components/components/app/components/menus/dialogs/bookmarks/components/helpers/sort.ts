import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { SortNodesBy } from '@cherryjuice/graphql-types';

export type PartialNode = Pick<QFullNode, 'name' | 'createdAt' | 'updatedAt'>;
const sortByNodeName = (xs: PartialNode[]) =>
  xs.sort((a, b) => a.name.localeCompare(b.name));
const sortByNodeUpdated = (xs: PartialNode[]): PartialNode[] =>
  xs.sort((a, b) => a.updatedAt - b.updatedAt);
const sortByNodeCreated = (xs: PartialNode[]): PartialNode[] =>
  xs.sort((a, b) => a.createdAt - b.createdAt);

export const mapSortNodesBy = {
  [SortNodesBy.CreatedAt]: sortByNodeCreated,
  [SortNodesBy.UpdatedAt]: sortByNodeUpdated,
  [SortNodesBy.DocumentName]: sortByNodeName,
  [SortNodesBy.NodeName]: sortByNodeName,
};
