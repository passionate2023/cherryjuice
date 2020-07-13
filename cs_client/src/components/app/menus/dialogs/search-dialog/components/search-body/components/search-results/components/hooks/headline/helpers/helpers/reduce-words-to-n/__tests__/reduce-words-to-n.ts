import { reduceWordsToN } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/helpers/reduce-words-to-n/reduce-words-to-n';

const data = [
  {
    input: {
      text: 'hello world, my name is yacine, today is sunny',
      length: 3,
      startFromEnd: false,
    },
    output: 'hello world, my ',
  },
  {
    input: {
      text: 'hello world, my name is yacine, today is sunny',
      length: 3,
      startFromEnd: true,
    },
    output: 'today is sunny',
  },
];

describe('reduce-words-to-n', () => {
  data.forEach(({ input, output }) => {
    it(JSON.stringify(input), () => {
      const res = reduceWordsToN({
        nOfWordsToLeave: input.length,
        startFromEnd: input.startFromEnd,
      })(input.text);
      expect(res).toEqual(output);
    });
  });
});
