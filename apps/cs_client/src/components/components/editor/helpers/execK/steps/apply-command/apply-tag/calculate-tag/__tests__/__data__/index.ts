export type TTag = [string, { [k: string]: string | object; style?: object }];
export type TTagTestSample = {
  meta: { name: string };
  input: {
    tags: TTag[];
    cmd: { tagName: string; remove: boolean };
  };
  output: TTag[];
};

import { genericTests } from '::editor/helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__/generic';

export { genericTests };
