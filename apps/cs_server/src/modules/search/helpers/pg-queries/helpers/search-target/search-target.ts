import {
  SearchOptions,
  SearchTarget,
  SearchType,
} from '../../../../it/node-search.it';
import { fts, HeadlineProps } from './helpers/fts';
import { regex } from './helpers/regex';
import { simple } from './helpers/simple';
import { ForbiddenException } from '@nestjs/common';
import { QueryCreatorState } from '../time-filter';
type PGHeadline = {
  nodeNameHeadline?: string;
  ahtmlHeadline?: string;
  tagsHeadline?: string;
};
const searchTargetsToColumnName = {
  [SearchTarget.nodeTitle]: {
    valueName: 'nodeNameHeadline',
    columnName: 'n."name"',
  },
  [SearchTarget.nodeContent]: {
    valueName: 'ahtmlHeadline',
    columnName: 'n."ahtml_txt"',
  },
  [SearchTarget.nodeTags]: {
    valueName: 'tagsHeadline',
    columnName: 'n."tags"',
  },
};
const createHeadlineGenerator = ({
  searchTarget,
  numberOfVariables,
  searchOptions,
  queryHasFlags,
}: Omit<HeadlineProps, 'columnName'> & {
  searchTarget: SearchTarget[];
  queryHasFlags: boolean;
}) => (fn): PGHeadline => {
  const res: PGHeadline = {
    nodeNameHeadline: undefined,
    ahtmlHeadline: undefined,
    tagsHeadline: undefined,
  };
  searchTarget.forEach(target => {
    const { valueName, columnName } = searchTargetsToColumnName[target];
    res[valueName] = fn({
      columnName,
      numberOfVariables,
      searchOptions,
      queryHasFlags,
    });
  });
  return res;
};

export enum FlagsPositionInVariablesList {
  flagsAndQuery = 2,
  flags = 1,
}

const insertQueryAndFlagsToVariablesList = (
  rawQuery: string,
  searchType: SearchType,
  state: QueryCreatorState,
) => {
  const maybeFlags =
    searchType === SearchType.Regex ? /(.+)\/(\w+)$/.exec(rawQuery) : undefined;
  if (maybeFlags) {
    const searchTerm = maybeFlags[1];
    const flags = maybeFlags[2];
    const tildeFlagAndQuery = `(?${flags})${searchTerm}`;
    state.variables.push(tildeFlagAndQuery);
    state.variables.push(flags);
    state.variables.push(searchTerm);
  } else {
    state.variables.push(rawQuery);
  }
  return !!maybeFlags;
};

type Props = {
  state: QueryCreatorState;
  query: string;
  searchType: SearchType;
  searchOptions: SearchOptions;
  searchTarget: SearchTarget[];
};
const searchTargetWC = ({
  searchOptions,
  searchType,
  query,
  state: qState,
  searchTarget,
}: Props): { orWhereClauses: string; headline?: PGHeadline } => {
  const queryHasFlags = insertQueryAndFlagsToVariablesList(
    query,
    searchType,
    qState,
  );
  const state = {
    whereClause: '',
  };
  const res = {
    orWhereClauses: [],
    headline: undefined,
  };

  const headlineGenerator = createHeadlineGenerator({
    numberOfVariables: qState.variables.length,
    searchTarget,
    searchOptions,
    queryHasFlags,
  });
  switch (searchType) {
    case SearchType.FullText:
      state.whereClause = fts.whereClause({
        searchOptions,
        variableIndex: qState.variables.length,
      });
      res.headline = headlineGenerator(fts.headline);
      break;
    case SearchType.Regex:
      state.whereClause = regex.whereClause({
        searchOptions,
        variableIndex: qState.variables.length,
        queryHasFlags,
      });
      res.headline = headlineGenerator(regex.headline);
      break;
    case SearchType.Simple:
      state.whereClause = simple.whereClause({
        searchOptions,
        variableIndex: qState.variables.length,
      });

      break;
  }
  if (!state.whereClause) throw new ForbiddenException();

  if (searchTarget.includes(SearchTarget.nodeTitle))
    res.orWhereClauses.push(`n."name" ${state.whereClause}`);
  if (searchTarget.includes(SearchTarget.nodeContent))
    res.orWhereClauses.push(`n."ahtml_txt" ${state.whereClause}`);
  if (searchTarget.includes(SearchTarget.nodeTags))
    res.orWhereClauses.push(`n."tags" ${state.whereClause}`);

  return {
    orWhereClauses: `( ${res.orWhereClauses.join(' or ')} )`,
    headline: res.headline,
  };
};

export { searchTargetWC };
