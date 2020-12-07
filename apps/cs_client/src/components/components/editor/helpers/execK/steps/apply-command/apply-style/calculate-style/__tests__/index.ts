import {
  testSamples,
  TStyleSample,
} from '::editor/helpers/execK/steps/apply-command/apply-style/calculate-style/__tests__/__data__';
import { calculateStyle } from '::editor/helpers/execK/steps/apply-command/apply-style/calculate-style';

const testStyle = ({
  input: { cmd, ogStyle },
  output,
  meta: { name },
}: TStyleSample) => {
  it(name, () => {
    const res = calculateStyle({ cmd, ogStyle, topLevelElement: true });
    expect(res).toEqual(output);
  });
};
describe('test apply-style logic', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  testSamples.filter(predicate(undefined)).forEach(testStyle);
});
