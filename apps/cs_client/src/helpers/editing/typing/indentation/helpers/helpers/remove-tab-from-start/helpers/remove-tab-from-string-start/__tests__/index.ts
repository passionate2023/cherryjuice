import { removeTabFromStringStart } from '::helpers/editing/typing/indentation/helpers/helpers/remove-tab-from-start/helpers/remove-tab-from-string-start/remove-tab-from-string-start';

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
  testSamples.forEach(({ input: { texts }, output }) => {
    it(JSON.stringify(texts), () => {
      const trimmedText = removeTabFromStringStart(texts);
      expect(trimmedText).toEqual(output);
    });
  });
});
