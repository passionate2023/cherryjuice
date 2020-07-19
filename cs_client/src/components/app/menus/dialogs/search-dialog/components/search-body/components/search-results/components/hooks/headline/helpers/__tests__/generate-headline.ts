import {
  generateHeadline,
  GenerateHeadlineProps,
  Headlines,
} from '../generate-headline';
import { SearchTarget, SearchType } from '::types/graphql/generated';

const common = {
  ahtml_txt: 'hello havid, Have a nice day',
  nodeName: 'node 1',
  nodeNameHeadline: '',
};
const commonSearchContext = {
  searchTarget: [SearchTarget.nodeContent],
};
const data: (GenerateHeadlineProps & { res: Headlines })[] = [
  ...[
    {
      searchContext: {
        ...commonSearchContext,
        searchType: SearchType.Simple,
        searchOptions: { caseSensitive: false, fullWord: false },
        query: 'Hav',
      },
      searchResult: {
        ...common,
        ahtmlHeadline: undefined,
      },
      res: {
        ahtmlHeadline: {
          start: 'hello ',
          match: 'hav',
          end: 'id, Have a nice day',
          index: 6,
        },
        nodeNameHeadline: undefined,
      },
    },
    {
      searchContext: {
        ...commonSearchContext,
        searchType: SearchType.Simple,
        searchOptions: { caseSensitive: true, fullWord: false },
        query: 'Hav',
      },
      searchResult: {
        ...common,
        ahtmlHeadline: undefined,
      },
      res: {
        ahtmlHeadline: {
          start: 'hello havid, ',
          match: 'Hav',
          end: 'e a nice day',
          index: 13,
        },
        nodeNameHeadline: undefined,
      },
    },
    {
      searchContext: {
        ...commonSearchContext,
        searchType: SearchType.Simple,
        searchOptions: { caseSensitive: false, fullWord: true },
        query: 'Have',
      },
      searchResult: {
        ...common,
        ahtmlHeadline: undefined,
      },
      res: {
        ahtmlHeadline: {
          start: 'hello havid, ',
          match: 'Have',
          end: ' a nice day',
          index: 13,
        },
        nodeNameHeadline: undefined,
      },
    },
  ],
  ...[
    {
      searchContext: {
        ...commonSearchContext,
        searchType: SearchType.FullText,
        searchOptions: { caseSensitive: false, fullWord: true },
        query: 'Have',
      },
      searchResult: {
        ...common,
        ahtmlHeadline: 'hello havid, <#>Have<#> a nice day',
      },
      res: {
        ahtmlHeadline: {
          start: 'hello havid, ',
          match: 'Have',
          end: ' a nice day',
          index: 16,
        },
        nodeNameHeadline: undefined,
      },
    },
  ],
  ...[
    {
      searchContext: {
        ...commonSearchContext,
        searchType: SearchType.Regex,
        searchOptions: { caseSensitive: false, fullWord: true },
        query: 'Have',
      },
      searchResult: {
        ...common,
        ahtmlHeadline: 'Have',
      },
      res: {
        ahtmlHeadline: {
          start: 'hello havid, ',
          match: 'Have',
          end: ' a nice day',
          index: 13,
        },
        nodeNameHeadline: undefined,
      },
    },
    {
      searchContext: {
        ...commonSearchContext,
        query: 'Hello',
        searchType: SearchType.Regex,
        searchOptions: { caseSensitive: true, fullWord: true },
      },
      searchResult: {
        ...common,
        ahtmlHeadline: 'Hello',
        ahtml_txt:
          "Hello again, and welcome to our final module on Clean Architecture. I'm Matthew Renze with Pluralsight, and in this final module we'll learn how to evolve our architecture over the life of the project. As an overview of this module, first we'll discuss how we can evolve our architecture to reduce risk due to uncertainty and changing requirements. Next, we'll discuss where to go for more information if you'd like to learn more about the topics in this course. Finally, we'll wrap up this module and the course as a whole.↵",
      },
      res: {
        ahtmlHeadline: {
          start: '',
          match: 'Hello',
          end: ' again, and welcome to our final module on Clean A',
          index: 0,
        },
        nodeNameHeadline: undefined,
      },
    },
  ],
];

describe('test generate-headline', () => {
  data.forEach(sample => {
    it(`${JSON.stringify(sample.searchContext)}`, () => {
      const res = generateHeadline(sample);
      expect(res).toEqual(sample.res);
    });
  });
});
