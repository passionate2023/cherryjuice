import { flattenIntoLines } from '../flatten-into-lines';
const testData = {
  test1: {
    input: [
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
      {
        _: 'bold italic blue text with pink bg',
        $: {
          background: '#f1f1c8c8c8c8',
          foreground: '#2c2c44445454',
          style: 'italic',
          weight: 'heavy',
        },
        $$: {
          'background-color': '#f1c8c8',
          color: '#2c4454',
          tags: ['em', 'strong'],
        },
      },
      ' ',
      {
        _: 'sourlign2 mono red color',
        $: {
          family: 'monospace',
          foreground: '#9a9a11119797',
          scale: 'small',
        },
        $$: {
          color: '#9a1197',
          tags: ['code', 'small'],
        },
      },
      '\n',
      {
        _: 'this is the second line, size h2, in pink',
        $: {
          foreground: '#e9e96161c7c7',
          scale: 'h2',
        },
        $$: {
          color: '#e961c7',
          tags: ['h2'],
        },
      },
      '\n\n    this is the fourth line. the previous line was empty',
    ],
    output: [
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
      {
        _: 'bold italic blue text with pink bg',
        $: {
          background: '#f1f1c8c8c8c8',
          foreground: '#2c2c44445454',
          style: 'italic',
          weight: 'heavy',
        },
        $$: {
          'background-color': '#f1c8c8',
          color: '#2c4454',
          tags: ['em', 'strong'],
        },
      },
      ' ',
      {
        _: 'sourlign2 mono red color',
        $: {
          family: 'monospace',
          foreground: '#9a9a11119797',
          scale: 'small',
        },
        $$: {
          color: '#9a1197',
          tags: ['code', 'small'],
        },
      },
      '\n',
      {
        _: 'this is the second line, size h2, in pink',
        $: {
          foreground: '#e9e96161c7c7',
          scale: 'h2',
        },
        $$: {
          color: '#e961c7',
          tags: ['h2'],
        },
      },
      '\n',
      '\n',
      '    this is the fourth line. the previous line was empty',
    ],
  },
  test2: {
    output: [
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
      {
        _: 'bold italic blue text with pink bg',
        $: {
          background: '#f1f1c8c8c8c8',
          foreground: '#2c2c44445454',
          style: 'italic',
          weight: 'heavy',
        },
        $$: {
          'background-color': '#f1c8c8',
          color: '#2c4454',
          tags: ['em', 'strong'],
        },
      },
      ' ',
      {
        _: 'sourlign2 mono red color',
        $: {
          family: 'monospace',
          foreground: '#9a9a11119797',
          scale: 'small',
        },
        $$: {
          color: '#9a1197',
          tags: ['code', 'small'],
        },
      },
      '\n',
      '\n',
      '\n',
      {
        _: 'this is the second line, size h2, in pink',
        $: {
          foreground: '#e9e96161c7c7',
          scale: 'h2',
        },
        $$: {
          color: '#e961c7',
          tags: ['h2'],
        },
      },
      '\n',
      '\n',
      '    this is the fourth line. the previous line was empty',
      '\n',
    ],
    input: [
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
      {
        _: 'bold italic blue text with pink bg',
        $: {
          background: '#f1f1c8c8c8c8',
          foreground: '#2c2c44445454',
          style: 'italic',
          weight: 'heavy',
        },
        $$: {
          'background-color': '#f1c8c8',
          color: '#2c4454',
          tags: ['em', 'strong'],
        },
      },
      ' ',
      {
        _: 'sourlign2 mono red color',
        $: {
          family: 'monospace',
          foreground: '#9a9a11119797',
          scale: 'small',
        },
        $$: {
          color: '#9a1197',
          tags: ['code', 'small'],
        },
      },
      '\n\n\n',
      {
        _: 'this is the second line, size h2, in pink',
        $: {
          foreground: '#e9e96161c7c7',
          scale: 'h2',
        },
        $$: {
          color: '#e961c7',
          tags: ['h2'],
        },
      },
      '\n\n    this is the fourth line. the previous line was empty',
      '\n',
    ],
  },
  test3: {
    input: [
      {
        _: '\n\nred text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
    ],
    output: [
      {
        _: '\n',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      {
        _: '\n',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000',
        },
        $$: {
          color: '#ff0000',
          tags: [],
        },
      },
      ' ',
    ],
  },
  test4: {
    input: [
      'this is the fourth line. the previous line was empty\n',
      {
        _: 'this ',
        $: {
          foreground: '#e9e96161c7c7',
        },
        $$: {
          color: '#e961c7',
          tags: [],
        },
      },
      {
        _: 'is',
        $: {
          foreground: '#e9e96161c7c7',
          underline: 'single',
        },
        $$: {
          color: '#e961c7',
          'text-decoration': 'underline',
          tags: [],
        },
      },
      {
        _: ' the fourth',
        $: {
          underline: 'single',
        },
        $$: {
          'text-decoration': 'underline',
          tags: [],
        },
      },
      ' line. the previous line was empty',
    ],

    output: [
      'this is the fourth line. the previous line was empty',
      '\n',
      {
        _: 'this ',
        $: {
          foreground: '#e9e96161c7c7',
        },
        $$: {
          color: '#e961c7',
          tags: [],
        },
      },
      {
        _: 'is',
        $: {
          foreground: '#e9e96161c7c7',
          underline: 'single',
        },
        $$: {
          color: '#e961c7',
          'text-decoration': 'underline',
          tags: [],
        },
      },
      {
        _: ' the fourth',
        $: {
          underline: 'single',
        },
        $$: {
          'text-decoration': 'underline',
          tags: [],
        },
      },
      ' line. the previous line was empty',
    ],
  },
  test5: {
    input: [
      '1. hello\n2. world!\n3. :D\n• hello\n• world\n• :D\n☐ hello\n☐ world\n☐ :D',
    ],
    output: [
      '1. hello',
      '\n',
      '2. world!',
      '\n',
      '3. :D',
      '\n',
      '• hello',
      '\n',
      '• world',
      '\n',
      '• :D',
      '\n',
      '☐ hello',
      '\n',
      '☐ world',
      '\n',
      '☐ :D',
    ],
  },
  test6: {
    input: [
      'tesla cyber truck:\n',
      {
        $: {
          justification: 'left',
        },
        $$: {
          'text-align': 'left',
          tags: [],
        },
      },
      '\n\ngoogle link: ',
      {
        _: 'https://google.com',
        $: {
          link: 'webs https://google.com',
        },
        $$: {
          tags: [
            [
              'a',
              [
                {
                  href: 'webs https://google.com',
                },
              ],
            ],
          ],
        },
      },
      ' ',
    ],
    output: [
      'tesla cyber truck:',
      '\n',
      {
        $: {
          justification: 'left',
        },
        $$: {
          'text-align': 'left',
          tags: [],
        },
      },
      '\n',
      '\n',
      'google link: ',
      {
        _: 'https://google.com',
        $: {
          link: 'webs https://google.com',
        },
        $$: {
          tags: [
            [
              'a',
              [
                {
                  href: 'webs https://google.com',
                },
              ],
            ],
          ],
        },
      },
      ' ',
    ],
  },
};
describe('it should split by newline character', () => {
  it('test1', () => {
    const { input, output } = testData.test1;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });
  it('test2', () => {
    const { input, output } = testData.test2;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });

  it('test3 (advanced)', () => {
    const { input, output } = testData.test3;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });
  it('test4 (advanced)', () => {
    const { input, output } = testData.test4;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });
  it('test5 (advanced)', () => {
    const { input, output } = testData.test5;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });
  it('test6 (advanced)', () => {
    const { input, output } = testData.test6;
    const res = flattenIntoLines(input);
    expect(res).toEqual(output);
  });
});
