import { SearchOptions } from '../../../../../it/node-search.it';

type SearchTypeQueryProps = {
  searchOptions: SearchOptions;
  variableIndex: number;
};

type HeadlineProps = {
  numberOfVariables: number;
  columnName: string;
};

const whereClause = ({
  searchOptions,
  variableIndex,
}: SearchTypeQueryProps): string =>
  `@@ to_tsquery($${variableIndex}${searchOptions.fullWord ? '' : "||':*'"})`;

const headline = ({ columnName, numberOfVariables }: HeadlineProps): string =>
  `ts_headline(${columnName},to_tsquery($${numberOfVariables}),'MinWords=5, MaxWords=35')`;

const fts = {
  whereClause,
  headline,
};

export { fts };
export { SearchTypeQueryProps, HeadlineProps };
