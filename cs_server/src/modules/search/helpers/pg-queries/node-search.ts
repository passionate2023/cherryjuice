import { NodeSearchDto } from '../../dto/node-search.dto';
import { searchScopeWC } from './helpers/search-scope';
import { searchTargetWC } from './helpers/search-target/search-target';
import { timeFilterWC } from './helpers/time-filter';
import { orderBy } from './helpers/order-by/order-by';
import { SearchTarget } from '../../it/node-search.it';

const nodeSearch = ({
  it,
  user,
}: NodeSearchDto): { query: string; variables: string[] } => {
  const {
    searchTarget,
    searchScope,
    query,
    nodeId,
    documentId,
    searchOptions,
    searchType,
    createdAtTimeFilter,
    updatedAtTimeFilter,
    sortOptions,
  } = it;
  const variables = [];
  const andWhereClauses: string[] = [];
  variables.push(user.id);
  andWhereClauses.push('n."userId" = $' + variables.length);

  andWhereClauses.push(
    ...timeFilterWC({
      state: { variables },
      createdAtTimeFilter,
      updatedAtTimeFilter,
    }),
  );
  andWhereClauses.push(
    searchScopeWC({ variables, searchScope, nodeId, documentId }),
  );

  const { headline, orWhereClauses } = searchTargetWC({
    searchTarget,
    searchType,
    variables,
    searchOptions,
    query,
  });
  andWhereClauses.push(orWhereClauses);
  const searchQuery = `
      select
        ${
          headline?.ahtmlHeadline
            ? `${headline.ahtmlHeadline} as "ahtmlHeadline",`
            : ''
        }
        ${
          headline?.nodeNameHeadline
            ? `${headline.nodeNameHeadline} as "nodeNameHeadline",`
            : ''
        }
        ${searchTarget.includes(SearchTarget.nodeContent) ? `n.ahtml_txt,` : ''}
        n.node_id, n.id as "nodeId", n.name as "nodeName", n."documentId", n."createdAt", n."updatedAt",
        d.name as "documentName"
        from node as n
        inner join document as d
        on d.id = n."documentId"
        where ${andWhereClauses.filter(Boolean).join(' and ')}
        ${orderBy({ sortOptions })};
  `;

  return {
    query: searchQuery,
    variables,
  };
};

export { nodeSearch };
