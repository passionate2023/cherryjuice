import { NodeSearchDto } from '../../dto/node-search.dto';
import { searchScopeWC } from './helpers/search-scope';
import { searchTargetWC } from './helpers/search-target/search-target';
import { timeFilterWC } from './helpers/time-filter';
import { orderBy } from './helpers/order-by/order-by';
import { SearchTarget } from '../../it/node-search.it';
import { ownershipWC } from './helpers/ownership';

const nodeSearch = ({
  it,
  userId,
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
  const state = { variables: [] };
  const andWhereClauses: string[] = [];

  andWhereClauses.push(ownershipWC({ state, userId }));

  andWhereClauses.push(
    ...timeFilterWC({
      state,
      createdAtTimeFilter,
      updatedAtTimeFilter,
    }),
  );
  andWhereClauses.push(
    searchScopeWC({ state, searchScope, nodeId, documentId }),
  );

  const { headline, orWhereClauses } = searchTargetWC({
    searchTarget,
    searchType,
    state,
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
        left join document_guest g on d.id = g."documentId"
        where ${andWhereClauses.filter(Boolean).join(' and ')}
        ${orderBy({ sortOptions })};
  `;

  return {
    query: searchQuery,
    variables: state.variables,
  };
};

export { nodeSearch };
