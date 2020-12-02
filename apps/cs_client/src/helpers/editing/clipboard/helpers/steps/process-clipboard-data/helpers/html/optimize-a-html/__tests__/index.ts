import { testSamples } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/__tests__/__data__';
import { optimizeAHtml } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/optimize-a-html';

const test = ({ meta: { name }, input: { aHtml }, output }) => {
  it(name + ' ', () => {
    const res = optimizeAHtml({ aHtml }, { removeClassAttribute: true });
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
