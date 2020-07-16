import { SearchSortOptions } from '../../../../it/node-search.it/it/search-sort-options';
import { SortNodesBy } from '../../../../it/node-search.it/enums/sort-nodes-by';
import { SortDirection } from '../../../../it/node-search.it/enums/sort-direction';

const map = {
  [SortNodesBy.CreatedAt]: 'n."createdAt"',
  [SortNodesBy.UpdatedAt]: 'n."updatedAt"',
  [SortNodesBy.NodeName]: 'n."name"',
  [SortNodesBy.DocumentName]: 'd."name"',
};
type OrderByProps = {
  sortOptions: SearchSortOptions;
};
const orderBy = ({
  sortOptions: { sortBy, sortDirection },
}: OrderByProps): string => {
  const expressions = Array.from(
    new Set([map[sortBy], ...Object.values(map)]),
  ).join(` ${sortDirection === SortDirection.Descending ? 'desc' : ''}, `);

  return `order by ${expressions}`;
};

export { orderBy };
