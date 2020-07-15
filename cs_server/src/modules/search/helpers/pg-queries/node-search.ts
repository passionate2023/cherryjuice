import { NodeSearchDto } from '../../dto/node-search.dto';
import { searchScopeWC } from './helpers/search-scope';
import { searchTargetWC } from './helpers/search-target/search-target';
import { timeFilterWC } from './helpers/time-filter';

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

  const { headline, orWhereClauses, searchedColumn } = searchTargetWC({
    searchTarget,
    searchType,
    variables,
    searchOptions,
    query,
  });
  andWhereClauses.push(orWhereClauses);
  const searchQuery = `
      select
        ${headline ? `${headline} as headline,` : ''}
        ${searchedColumn ? `${searchedColumn} as "searchedColumn",` : ''}
        n.node_id, n.id as "nodeId", n.name as "nodeName", n."documentId", n."createdAt", n."updatedAt",
        d.name as "documentName"
        from node as n
        inner join document as d
        on d.id = n."documentId"
        where ${andWhereClauses.filter(Boolean).join(' and ')};
  `;

  return {
    query: searchQuery,
    variables,
  };
};

export { nodeSearch };
