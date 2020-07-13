import { HeadlineProps, SearchTypeQueryProps } from './fts';

const whereClause = ({
  searchOptions,
  variableIndex,
}: SearchTypeQueryProps): string =>
  `${searchOptions.caseSensitive ? 'LIKE' : 'ILIKE'} (${
    searchOptions.fullWord ? '' : "'%'||"
  }$${variableIndex}${searchOptions.fullWord ? '' : "||'%'"})`;

const headline = ({ columnName }: HeadlineProps): string => `${columnName}`;

const simple = {
  whereClause: whereClause,
  headline: headline,
};

export { simple };
