import { flattenAHtml } from '::helpers/rendering/html-to-ahtml/steps/flatten-ahtml';

const testSamples = [
  {
    meta: { name: 'sub-ddoe has br and has text' },
    input: {
      acc: [{ tags: [['img']] }],
      current: {
        _: 'hello',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }],
          ['br'],
          ['a', { foo: 'a' }],
        ],
      },
    },
    output: [
      { tags: [['img']] },
      {
        _: 'hello',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }],
        ],
      },
      '\n',
      {
        _: '',
        tags: [['a', { foo: 'a' }]],
      },
    ],
  },
  {
    meta: { name: 'sub-ddoe has br but has no text' },
    input: {
      acc: [{ tags: [['img']] }],
      current: {
        _: '',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }],
          ['br'],
          ['a', { foo: 'a' }],
        ],
      },
    },
    output: [
      { tags: [['img']] },
      {
        _: '',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }],
          ['a', { foo: 'a' }],
        ],
      },
    ],
  },
];

describe('html-to-aHtml', () => {
  testSamples.forEach(({ meta: { name }, input: { acc, current }, output }) => {
    it(name, () => {
      const { newAcc } = flattenAHtml({ acc, aHtml: current });
      expect(newAcc).toEqual(output);
    });
  });
});
