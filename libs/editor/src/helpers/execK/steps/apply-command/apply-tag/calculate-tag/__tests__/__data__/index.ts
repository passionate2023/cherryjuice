export type TTag = [string, { [k: string]: string | object; style?: object }];
export type TTagTestSample = {
  meta: { name: string };
  input: {
    tags: TTag[];
    cmd: { tagName: string; remove: boolean };
  };
  output: TTag[];
};

// @ts-ignore
export { genericTests } from './generic/index';
