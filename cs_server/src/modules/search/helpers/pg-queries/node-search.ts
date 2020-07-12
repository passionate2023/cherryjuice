import { NodeSearchDto } from '../../dto/node-search.dto';
import { searchScopeWC } from './helpers/search-scope';
import { searchTargetWC } from './helpers/search-target/search-target';

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
  } = it;
  const variables = [];
  const andWhereClauses = [];
  variables.push(user.id);
  andWhereClauses.push('n."userId" = $' + variables.length);

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
        ${headline} as headline, 
        n.node_id, n.id as "nodeId", n.name as "nodeName", n."documentId", d.name as "documentName"
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
