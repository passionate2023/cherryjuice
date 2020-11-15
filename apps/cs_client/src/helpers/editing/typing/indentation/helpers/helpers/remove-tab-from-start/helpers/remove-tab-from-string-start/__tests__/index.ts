import { removeTabFromStringStart } from '::helpers/editing/typing/indentation/helpers/helpers/remove-tab-from-start/helpers/remove-tab-from-string-start/remove-tab-from-string-start';
import { DOUBLE_SPACE, QUAD_SPACE } from '@cherryjuice/ahtml-to-html';

const testSamples = [
  {
    input: { texts: [' \u00A0 \u00A0', ' yacine'] },
    output: ' yacine',
  },
  {
    input: { texts: ['\u00A0 \u00A0 ', '  yacine'] },
    output: DOUBLE_SPACE + 'yacine',
  },
  {
    input: { texts: ['\t \u00A0 ', ' yacine'] },
    output: QUAD_SPACE + 'yacine',
  },
  {
    input: { texts: ['\t\t \u00A0 ', ' yacine'] },
    output: QUAD_SPACE + QUAD_SPACE + 'yacine',
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
