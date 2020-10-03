import {
  isPresentationalTable,
  splitTableByRow,
} from '::helpers/editing/clipboard/parse-table';
import { testSamples } from '::helpers/editing/clipboard/parse-table/__tests__/__data__';

const testSplitTableByRow = ({
  meta: { name },
  input: { table },
  output: { elements },
}) => {
  it(name + ' ', () => {
    const res = splitTableByRow({ table });
    if (elements.length) expect(res).toEqual(elements);
  });
};
const testIsPresentationalTable = ({
  meta: { name },
  input: { table },
  output: { presentational },
}) => {
  it(name + ' ', () => {
    const res = isPresentationalTable({ table });
    expect(res).toEqual(presentational);
  });
};

describe('split table by row', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  testSamples
    .filter(predicate(undefined))
    .filter(({ output: { elements } }) => elements.length)
    .forEach(sample => {
      testSplitTableByRow(sample);
    });
});

describe('is presentational table', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  testSamples.filter(predicate(undefined)).forEach(sample => {
    testIsPresentationalTable(sample);
  });
});
