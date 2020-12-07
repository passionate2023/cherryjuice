import { calculateTag } from '::editor/helpers/execK/steps/apply-command/apply-tag/calculate-tag';
import {
  genericTests,
  TTagTestSample,
} from '::editor/helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__';
import { specificTests } from '::editor/helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__/specific';

const testTemplate = ({
  input: { cmd, tags },
  output,
  meta: { name },
}: TTagTestSample) => {
  it(name + ' ' + JSON.stringify(cmd), () => {
    const res = calculateTag({ cmd, tags });
    expect(res.sort()).toEqual(output.sort());
  });
};
describe('test apply-tag logic against generic-tests', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  genericTests.filter(predicate(undefined)).forEach(testTemplate);
});
describe('test apply-tag logic against specific-tests', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  specificTests.filter(predicate(undefined)).forEach(testTemplate);
});
// describe('test apply-tag logic against use-causes', () => {
//   const predicate = filter => ({ meta: { name } }) =>
//     filter ? name === filter : name;
//   testSamples.filter(predicate(undefined)).forEach(testTemplate);
// });
