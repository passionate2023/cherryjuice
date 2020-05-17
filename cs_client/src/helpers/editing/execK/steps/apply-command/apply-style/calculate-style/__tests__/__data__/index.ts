import { underline } from './underline';
import { lineThrough } from './line-through';
import { backgroundColor } from './background-color';
import { color } from './color';

const testSamples = [
  ...underline,
  ...lineThrough,
  ...color,
  ...backgroundColor,
];
type TStyleSample = typeof testSamples[0];

export { testSamples, TStyleSample };
