import { TTagTestSample } from '::editor/helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__';

const n54: TTagTestSample = {
  meta: { name: 'n54' },
  input: { tags: [['span', {}]], cmd: { tagName: 'code', remove: false } },
  output: [['code', {}]],
};
const n54remove: TTagTestSample = {
  meta: { name: 'n54 remove' },
  input: { tags: [['span', {}]], cmd: { tagName: 'code', remove: true } },
  output: [['span', {}]],
};

export { n54, n54remove };
