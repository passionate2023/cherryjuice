import { calculateTag } from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag';
import {
  genericTests,
  TTagTestSample
} from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__';

const testTemplate = ({
  input: { cmd, tags },
  output,
  meta: { name }
}: TTagTestSample) => {
  it(name, () => {
    const res = calculateTag({ cmd, tags });
    console.log('* cmd', cmd);
    console.log('* tags', tags);
    console.log('* expected', output.sort());
    console.log('* result', res.sort());
    expect(res.sort()).toEqual(output.sort());
  });
};
describe('test apply-tag logic against generic-tests', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  genericTests.filter(predicate(undefined)).forEach(testTemplate);
});
// describe('test apply-tag logic against use-causes', () => {
//   const predicate = filter => ({ meta: { name } }) =>
//     filter ? name === filter : name;
//   testSamples.filter(predicate(undefined)).forEach(testTemplate);
// });
