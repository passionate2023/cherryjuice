import { negativeIndent } from '::helpers/typing/negative-indent';

const testSamples = [
  {
    input: { texts: [' \u00A0 \u00A0', ' yacine'] },
    output: ' yacine',
  },
  { input: { texts: ['\u00A0 \u00A0 ', '  yacine'] }, output: '\u00A0 yacine' },
  {
    input: { texts: ['\t \u00A0 ', ' yacine'] },
    output: '\u00A0 \u00A0 yacine',
  },
  {
    input: { texts: ['\t\t \u00A0 ', ' yacine'] },
    output: '\u00A0 \u00A0 \u00A0 \u00A0 yacine',
  },
];

describe('negative indent', () => {
  testSamples.forEach(({ input: { texts }, output }, i) => {
    it(JSON.stringify(texts), () => {
      const trimmedText = negativeIndent(texts);
      expect(trimmedText).toEqual(output);
    });
  });
});
