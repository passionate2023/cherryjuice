import { HeadlineProps, SearchTypeQueryProps } from './fts';

const whereClause = ({
  searchOptions,
  variableIndex,
}: SearchTypeQueryProps): string =>
  `~${searchOptions.caseSensitive ? '' : '*'} $${variableIndex}`;

const headline = ({ columnName, numberOfVariables }: HeadlineProps): string =>
  `(regexp_matches(${columnName}, $${numberOfVariables}))[1]`;

const regex = {
  whereClause: whereClause,
  headline: headline,
};

export { regex };
