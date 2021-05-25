import { HeadlineProps, SearchTypeQueryProps } from './fts';
import { FlagsPositionInVariablesList } from '../search-target';

const whereClause = ({
  searchOptions,
  variableIndex,
  queryHasFlags,
}: SearchTypeQueryProps & { queryHasFlags: boolean }): string =>
  `~${searchOptions.caseSensitive ? '' : '*'} $${
    variableIndex -
    (queryHasFlags ? FlagsPositionInVariablesList.flagsAndQuery : 0)
  }`;

const headline = ({
  columnName,
  numberOfVariables,
  queryHasFlags,
}: HeadlineProps & { queryHasFlags: boolean }): string =>
  `(regexp_matches(${columnName}, $${numberOfVariables}${
    queryHasFlags
      ? `, $${numberOfVariables - FlagsPositionInVariablesList.flags}`
      : ''
  }))[1]`;

const regex = {
  whereClause: whereClause,
  headline: headline,
};

export { regex };
