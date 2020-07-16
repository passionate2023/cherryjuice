import { SearchOptions, SearchType } from '::types/graphql/generated';

const createTextClamper = (startFromEnd: boolean) => (
  nOfCharacters: number,
) => (text: string): string => {
  return startFromEnd
    ? text.substring(text.length - nOfCharacters)
    : text.substring(0, nOfCharacters);
};
const reduceWordsFromEnd = createTextClamper(true)(50);
const reduceWordsFromStart = createTextClamper(false)(50);

type Headline = {
  start: string;
  match: string;
  end: string;
  index: number;
};

type GenerateHeadlineProps = {
  query: string;
  searchType: SearchType;
  searchOptions: SearchOptions;
  headline: string;
  searchedColumn: string;
};

const generateHeadline = ({
  query,
  searchType,
  searchOptions: { caseSensitive, fullWord },
  headline,
  searchedColumn,
}: GenerateHeadlineProps): Headline => {
  let res;
  try {
    if (searchType === SearchType.Simple) {
      // if (!caseSensitive) query = query.toLowerCase();
      const reg = new RegExp(
        `${fullWord ? '\\b' : ''}${query}${fullWord ? '\\b' : ''}`,
        caseSensitive ? '' : 'i',
      );
      const execArray = reg.exec(searchedColumn);
      const match = execArray[0];
      const index = execArray.index;
      res = {
        start: searchedColumn.substring(0, index),
        match,
        end: searchedColumn.substring(index + match.length),
        index,
      };
    } else if (searchType === SearchType.FullText) {
      const [start, match, end] = headline.split('<#>');
      const index = headline.indexOf('<#>') + 3;
      res = {
        start,
        match,
        end,
        index,
      };
    } else if (searchType === SearchType.Regex) {
      const [start, end] = searchedColumn.split(headline);
      const index = start.length;
      res = {
        start,
        match: headline,
        end,
        index,
      };
    }
    res.start = reduceWordsFromEnd(res.start);
    res.end = reduceWordsFromStart(res.end);
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      `could not generate headline for [headline:${headline}] [searchedColumn:${searchedColumn}] ]`,
      { query, searchType, caseSensitive, fullWord },
      e,
    );
    return undefined;
  }
};

export { generateHeadline };
export { GenerateHeadlineProps, Headline };
