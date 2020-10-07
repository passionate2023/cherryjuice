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
}: Omit<HeadlineProps, 'columnName'> & { searchTarget: SearchTarget[] }) => (
  fn,
): PGHeadline => {
  const res: PGHeadline = {
    nodeNameHeadline: undefined,
    ahtmlHeadline: undefined,
    tagsHeadline: undefined,
  };
  searchTarget.forEach(target => {
    const { valueName, columnName } = searchTargetsToColumnName[target];
    res[valueName] = fn({ columnName, numberOfVariables, searchOptions });
  });
  return res;
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
  qState.variables.push(query);
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
