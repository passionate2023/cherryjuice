import {
  generateHeadline,
  GenerateHeadlineProps,
  Headline,
} from '../generate-headline';
import { SearchType } from '::types/graphql/generated';

const common = {
  text: 'hello havid, Have a nice day',
};

const data: (GenerateHeadlineProps & { res: Headline; testName: string })[] = [
  ...[
    {
      testName: 'simple',
      headline: common.text,
      searchType: SearchType.Simple,
      query: 'Hav',
      searchOptions: { caseSensitive: false, fullWord: false },
      res: {
        start: 'hello ',
        match: 'hav',
        end: 'id, Have a nice day',
        index: 6,
      },
    },
    {
      testName: 'simple',
      headline: common.text,
      searchType: SearchType.Simple,
      query: 'Hav',
      searchOptions: { caseSensitive: true, fullWord: false },
      res: {
        start: 'hello havid, ',
        match: 'Hav',
        end: 'e a nice day',
        index: 13,
      },
    },
    {
      testName: 'simple',
      headline: common.text,
      searchType: SearchType.Simple,
      query: 'Have',
      searchOptions: { caseSensitive: false, fullWord: true },
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
      testName: 'fulltext',
      headline: 'hello havid, <#>Have<#> a nice day',
      searchType: SearchType.FullText,
      query: 'Have',
      searchOptions: { caseSensitive: false, fullWord: true },
      res: {
        start: 'hello havid, ',
        match: 'Have',
        end: ' a nice day',
        index: 16,
      },
    },
  ],
];

describe('test generate-headline', () => {
  data.forEach(sample => {
    it(`${sample.testName} ${JSON.stringify({
      query: sample.query,
      ...sample.searchOptions,
    })}`, () => {
      const res = generateHeadline(sample);
      expect(res).toEqual(sample.res);
    });
  });
});
