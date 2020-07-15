import {
  generateHeadline,
  GenerateHeadlineProps,
  Headline,
} from '../generate-headline';
import { SearchType } from '::types/graphql/generated';

const common = {
  text: 'hello havid, Have a nice day',
};

const data: (GenerateHeadlineProps & { res: Headline })[] = [
  ...[
    {
      searchType: SearchType.Simple,
      searchOptions: { caseSensitive: false, fullWord: false },
      query: 'Hav',
      searchedColumn: common.text,
      headline: undefined,
      res: {
        start: 'hello ',
        match: 'hav',
        end: 'id, Have a nice day',
        index: 6,
      },
    },
    {
      searchType: SearchType.Simple,
      searchOptions: { caseSensitive: true, fullWord: false },
      query: 'Hav',
      searchedColumn: common.text,
      headline: undefined,
      res: {
        start: 'hello havid, ',
        match: 'Hav',
        end: 'e a nice day',
        index: 13,
      },
    },
    {
      searchType: SearchType.Simple,
      searchOptions: { caseSensitive: false, fullWord: true },
      query: 'Have',
      searchedColumn: common.text,
      headline: undefined,
      res: {
        start: 'hello havid, ',
        match: 'Have',
        end: ' a nice day',
        index: 13,
      },
    },
  ],
  ...[
    {
      searchType: SearchType.FullText,
      searchOptions: { caseSensitive: false, fullWord: true },
      query: 'Have',
      headline: 'hello havid, <#>Have<#> a nice day',
      searchedColumn: undefined,
      res: {
        start: 'hello havid, ',
        match: 'Have',
        end: ' a nice day',
        index: 16,
      },
    },
  ],
  ...[
    {
      searchType: SearchType.Regex,
      searchOptions: { caseSensitive: false, fullWord: true },
      query: 'Have',
      headline: 'Have',
      searchedColumn: 'hello havid, Have a nice day',
      res: {
        start: 'hello havid, ',
        match: 'Have',
        end: ' a nice day',
        index: 13,
      },
    },
    {
      query: 'Hello',
      headline: 'Hello',
      searchType: SearchType.Regex,
      searchOptions: { caseSensitive: true, fullWord: true },
      res: {
        start: '',
        match: 'Hello',
        end: ' again, and welcome to our final ',
        index: 0,
      },
      searchedColumn:
        "Hello again, and welcome to our final module on Clean Architecture. I'm Matthew Renze with Pluralsight, and in this final module we'll learn how to evolve our architecture over the life of the project. As an overview of this module, first we'll discuss how we can evolve our architecture to reduce risk due to uncertainty and changing requirements. Next, we'll discuss where to go for more information if you'd like to learn more about the topics in this course. Finally, we'll wrap up this module and the course as a whole.↵",
    },
  ],
];

describe('test generate-headline', () => {
  data.forEach(sample => {
    it(`${sample.searchType} ${JSON.stringify({
      query: sample.query,
      ...sample.searchOptions,
    })}`, () => {
      const res = generateHeadline(sample);
      expect(res).toEqual(sample.res);
    });
  });
});
