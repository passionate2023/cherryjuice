import { testSamples } from '::helpers/clipboard/optimize-ahtml/__tests__/__data__';
import { optimizeAHtml } from '::helpers/clipboard/optimize-ahtml';

const test = ({ meta: { name }, input: { aHtml }, output }) => {
  it(name + ' ', () => {
    const res = optimizeAHtml({ aHtml });
    expect(res).toEqual(output);
  });
};

describe('optimize-aHtml test', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  testSamples.filter(predicate(undefined)).forEach(sample => {
    test(sample);
  });
});
