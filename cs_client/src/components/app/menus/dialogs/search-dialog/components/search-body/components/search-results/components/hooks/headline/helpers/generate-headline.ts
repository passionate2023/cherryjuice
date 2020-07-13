import { SearchOptions, SearchType } from '::types/graphql/generated';
import { reduceWordsToN } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/helpers/reduce-words-to-n/reduce-words-to-n';
const reduceWordsFromEndTo3 = reduceWordsToN({
  nOfWordsToLeave: 3,
  startFromEnd: true,
});
const reduceWordsFromStartTo3 = reduceWordsToN({
  nOfWordsToLeave: 3,
  startFromEnd: false,
});

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
    res.start = reduceWordsFromEndTo3(res.start);
    res.end = reduceWordsFromStartTo3(res.end);
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
