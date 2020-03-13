import { hoistAHtmlProperties } from '::helpers/execK/steps/apply-command/hoist-properties';

const testSamples = [
  {
    meta: { name: 'should move all attributes to the lowest tag' },
    input: {
      tags: [
        ['div', { foo: 'div' }],
        ['span', { baz: 'span' }],
        ['h1', { bar: 'h1', foo: 'h1' }],
      ],
    },
    output: [
      ['div', {}],
      ['span', {}],
      ['h1', { baz: 'span', foo: 'h1', bar: 'h1' }],
    ],
  },
  {
    meta: { name: 'should merge object attributes' },
    input: {
      tags: [
        ['div', { foo: { div: '1' } }],
        ['span', { baz: 'span' }],
        ['h1', { bar: 'h1', foo: { h1: '1' } }],
      ],
    },
    output: [
      ['div', {}],
      ['span', {}],
      ['h1', { baz: 'span', foo: { h1: '1', div: '1' }, bar: 'h1' }],
    ],
  },
];

const testTemplate = ({ meta: { name }, input: { tags }, output }) => {
  it(name, () => {
    const res = hoistAHtmlProperties({ tags });
    expect(res.sort()).toEqual(output.sort());
  });
};

describe('test hoistAHtmlProperties', () => {
  testSamples.forEach(testTemplate);
});
