import { flattenAHtml } from '::helpers/execK/helpers/html-to-ahtml/steps/flatten-ahtml';

const testSamples = [
  {
    input: {
      acc: [{ tags: [['img']] }],
      current: {
        _: 'hello',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }],
          ['br'],
          ['a', { foo: 'a' }]
        ]
      }
    },
    output: [
      { tags: [['img']] },
      {
        _: 'hello',
        tags: [
          ['span', { foo: 'span', bam: 'span' }],
          ['p', { foo: 'p' }]
        ]
      },
      '\n',
      {
        _: '',
        tags: [['a', { foo: 'a' }]]
      }
    ]
  }
];

describe('html-to-aHtml', () => {
  testSamples.forEach(({ input: { acc, current }, output }, i) => {
    it('should push br to acc - ' + i, () => {
      const res = flattenAHtml({ acc, aHtml: current });
      console.log(res);
      expect(res).toEqual(output);
    });
  });
});
