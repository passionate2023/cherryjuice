import { hoistAHtmlProperties } from '::editor/helpers/execK/steps/apply-command/hoist-properties';

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
  {
    meta: {
      name:
        'should merge object attributes, and concatenate their conflicting strings',
    },
    input: {
      tags: [
        ['div', { foo: { div: '1' } }],
        [
          'span',
          {
            baz: 'span',
            foo: { h1: '2' },
            style: { 'text-decoration': '2', bg: '2' },
          },
        ],
        [
          'h1',
          {
            bar: 'h1',
            foo: { h1: '1' },
            style: { 'text-decoration': '1', bg: '1' },
          },
        ],
      ],
    },
    output: [
      ['div', {}],
      ['span', {}],
      [
        'h1',
        {
          baz: 'span',
          foo: { h1: '1', div: '1' },
          bar: 'h1',
          style: { 'text-decoration': '2 1', bg: '1' },
        },
      ],
    ],
  },
  {
    meta: {
      name:
        'should move all attributes to the lowest tag and ignore attributes of whitelisted tags except the style attribute',
    },
    input: {
      tags: [
        ['div', { foo: 'div' }],
        ['a', { foo: 'a', style: 'a' }],
        ['span', { baz: 'span' }],
        ['img', { foo: 'img' }],
        ['code', { foo: 'code', class: 'rich-text__code' }],
        ['table', { foo: 'table' }],
        ['h1', { bar: 'h1', foo: 'h1' }],
      ],
    },
    output: [
      ['div', {}],
      ['a', { foo: 'a' }],
      ['span', {}],
      ['img', { foo: 'img' }],
      ['code', { foo: 'code', class: 'rich-text__code' }],
      ['table', { foo: 'table' }],
      ['h1', { baz: 'span', foo: 'h1', bar: 'h1', style: 'a' }],
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
