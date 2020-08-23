import {
  NodeSearchIt,
  NodeSearchResultEntity,
  SearchTarget,
  SearchType,
} from '::types/graphql/generated';
import { simpleHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/helpers/simple';
import { ftsHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/helpers/fts';
import { regexHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/helpers/regexHeadline';

const createTextClamper = (startFromEnd: boolean) => (
  nOfCharacters: number,
) => (text: string): string => {
  return startFromEnd
    ? text.substring(text.length - nOfCharacters)
    : text.substring(0, nOfCharacters);
};
const reduceWordsFromEnd = createTextClamper(true)(50);
const reduceWordsFromStart = createTextClamper(false)(50);

const clampStartAndEnd = (res: Headlines): void => {
  Object.keys(res).forEach(headlineName => {
    if (res[headlineName]) {
      res[headlineName].start = reduceWordsFromEnd(res[headlineName].start);
      res[headlineName].end = reduceWordsFromStart(res[headlineName].end);
    }
  });
};

type Headline = {
  start: string;
  match: string;
  end: string;
  index: number;
};

type SearchContext = Pick<
  NodeSearchIt,
  'query' | 'searchType' | 'searchOptions' | 'searchTarget'
>;
type SearchResult = Pick<
  NodeSearchResultEntity,
  'ahtmlHeadline' | 'nodeNameHeadline' | 'ahtml_txt' | 'nodeName'
>;
type GenerateHeadlineProps = {
  searchContext: SearchContext;
  searchResult: SearchResult;
};

type Headlines = {
  nodeNameHeadline: Headline;
  ahtmlHeadline: Headline;
};
const generateHeadline = ({
  searchContext: { query, searchType, searchOptions, searchTarget },
  searchResult: { nodeNameHeadline, ahtmlHeadline, ahtml_txt, nodeName },
}: GenerateHeadlineProps): Headlines => {
  const res: Headlines = {
    ahtmlHeadline: undefined,
    nodeNameHeadline: undefined,
  };
  const a = {
    query,
    searchOptions,
    column: nodeName,
    headline: nodeNameHeadline,
  };
  const b = {
    query,
    searchOptions,
    column: ahtml_txt,
    headline: ahtmlHeadline,
  };
  try {
    const fn =
      searchType === SearchType.Simple
        ? simpleHeadline
        : searchType === SearchType.FullText
        ? ftsHeadline
        : regexHeadline;

    if (searchTarget.includes(SearchTarget.nodeTitle))
      res.nodeNameHeadline = fn(a);
    if (searchTarget.includes(SearchTarget.nodeContent))
      res.ahtmlHeadline = fn(b);
    clampStartAndEnd(res);
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      `could not generate headline
       [e:${e}]
       [res: ${JSON.stringify(res)}]
       [searchOptions: ${JSON.stringify(searchOptions)}]
       [searchType:${searchType}]
       [nodeNameHeadline:${nodeNameHeadline}]
       [query:${query}]
       [ahtmlHeadline:${ahtmlHeadline}]`,
    );
    return undefined;
  }
};

export { generateHeadline };
export {
  Headlines,
  GenerateHeadlineProps,
  Headline,
  SearchContext,
  SearchResult,
};
