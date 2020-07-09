import {
  SearchOptions,
  SearchTarget,
  SearchType,
} from '../../../../it/node-search.it';
import { fts } from './helpers/fts';
import { regex } from './helpers/regex';
import { simple } from './helpers/simple';
import { ForbiddenException } from '@nestjs/common';

type Props = {
  variables: string[];
  query: string;
  searchType: SearchType;
  searchOptions: SearchOptions;
  searchTarget: SearchTarget[];
};
const searchTargetWC = ({
  searchOptions,
  searchType,
  query,
  variables,
  searchTarget,
}: Props) => {
  variables.push(query);
  const variableQueryParts = {
    orWhereClauses: [],
    headline: '',
    whereClause: '',
  };
  const headlineVariables = {
    numberOfVariables: variables.length,
    columnName: searchTarget.includes(SearchTarget.nodeContent)
      ? 'n.ahtml_txt'
      : 'n.name',
  };
  switch (searchType) {
    case SearchType.FullText:
      variableQueryParts.whereClause = fts.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });
      variableQueryParts.headline = fts.headline(headlineVariables);
      break;
    case SearchType.Regex:
      variableQueryParts.whereClause = regex.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });
      variableQueryParts.headline = regex.headline(headlineVariables);
      break;
    case SearchType.Simple:
      variableQueryParts.whereClause = simple.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });

      variableQueryParts.headline = simple.headline(headlineVariables);
      break;
  }
  if (!variableQueryParts.whereClause) throw new ForbiddenException();
  if (searchTarget.includes(SearchTarget.nodeContent))
    variableQueryParts.orWhereClauses.push(
      `n."ahtml_txt" ${variableQueryParts.whereClause}`,
    );

  if (searchTarget.includes(SearchTarget.nodeTitle))
    variableQueryParts.orWhereClauses.push(
      `n."name" ${variableQueryParts.whereClause}`,
    );

  return {
    orWhereClauses: `( ${variableQueryParts.orWhereClauses.join(' or ')} )`,
    headline: variableQueryParts.headline,
  };
};

export { searchTargetWC };
