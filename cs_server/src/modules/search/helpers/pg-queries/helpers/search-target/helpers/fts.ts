import { SearchOptions } from '../../../../../it/node-search.it';

type SearchTypeQueryProps = {
  searchOptions: SearchOptions;
  variableIndex: number;
};

type HeadlineProps = {
  numberOfVariables: number;
  columnName: string;
  searchOptions?: SearchOptions;
};

const whereClause = ({
  searchOptions,
  variableIndex,
}: SearchTypeQueryProps): string =>
  `@@ to_tsquery($${variableIndex}${searchOptions.fullWord ? '' : "||':*'"})`;

const headline = ({
  columnName,
  numberOfVariables,
  searchOptions,
}: HeadlineProps): string =>
  `ts_headline(${columnName},to_tsquery($${numberOfVariables}${
    searchOptions.fullWord ? '' : "||':*'"
  }),'MinWords=5, MaxWords=35,StartSel=<#>, StopSel=<#>')`;

const fts = {
  whereClause,
  headline,
};

export { fts };
export { SearchTypeQueryProps, HeadlineProps };
