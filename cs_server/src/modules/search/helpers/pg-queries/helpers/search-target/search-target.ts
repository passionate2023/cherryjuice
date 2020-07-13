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
  const state = {
    whereClause: '',
  };
  const res = {
    orWhereClauses: [],
    headline: undefined,
    searchedColumn: undefined,
  };
  const headlineVariables = {
    numberOfVariables: variables.length,
    columnName: searchTarget.includes(SearchTarget.nodeContent)
      ? 'n.ahtml_txt'
      : 'n.name',
    searchOptions,
  };
  switch (searchType) {
    case SearchType.FullText:
      state.whereClause = fts.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });
      res.headline = fts.headline(headlineVariables);
      break;
    case SearchType.Regex:
      state.whereClause = regex.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });
      res.headline = regex.headline(headlineVariables);
      res.searchedColumn = `${headlineVariables.columnName}`;
      break;
    case SearchType.Simple:
      state.whereClause = simple.whereClause({
        searchOptions,
        variableIndex: variables.length,
      });

      res.searchedColumn = `${headlineVariables.columnName}`;
      break;
  }
  if (!state.whereClause) throw new ForbiddenException();
  if (searchTarget.includes(SearchTarget.nodeContent))
    res.orWhereClauses.push(`n."ahtml_txt" ${state.whereClause}`);

  if (searchTarget.includes(SearchTarget.nodeTitle))
    res.orWhereClauses.push(`n."name" ${state.whereClause}`);

  return {
    orWhereClauses: `( ${res.orWhereClauses.join(' or ')} )`,
    headline: res.headline,
    searchedColumn: res.searchedColumn,
  };
};

export { searchTargetWC };
