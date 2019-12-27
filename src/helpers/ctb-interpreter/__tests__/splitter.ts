import { splitter } from '../splitter';
import { separator } from '../separator';
const testData = {
  test1: {
    input: [
      {
        _: 'red text',
        $: {
          foreground: '#ffff00000000'
        },
        $$: {
          color: '#ff0000',
          tags: []
        }
      },
      ' ',
      {
        _: 'bold italic blue text with pink bg',
        $: {
          background: '#f1f1c8c8c8c8',
          foreground: '#2c2c44445454',
          style: 'italic',
          weight: 'heavy'
        },
        $$: {
          'background-color': '#f1c8c8',
          color: '#2c4454',
          tags: ['em', 'strong']
        }
      },
      ' ',
      {
        _: 'sourlign2 mono red color',
        $: {
          family: 'monospace',
          foreground: '#9a9a11119797',
          scale: 'small'
        },
        $$: {
          color: '#9a1197',
          tags: ['code', 'small']
        }
      },
      '\n',
      {
        _: 'this is the second line, size h2, in pink',
        $: {
          foreground: '#e9e96161c7c7',
          scale: 'h2'
        },
        $$: {
          color: '#e961c7',
          tags: ['h2']
        }
      },
      '\n\n    this is the fourth line. the previous line was empty'
    ],
    output: [
      [
        {
          _: 'red text',
          $: {
            foreground: '#ffff00000000'
          },
          $$: {
            color: '#ff0000',
            tags: []
          }
        },
        ' ',
        {
          _: 'bold italic blue text with pink bg',
          $: {
            background: '#f1f1c8c8c8c8',
            foreground: '#2c2c44445454',
            style: 'italic',
            weight: 'heavy'
          },
          $$: {
            'background-color': '#f1c8c8',
            color: '#2c4454',
            tags: ['em', 'strong']
          }
        },
        ' ',
        {
          _: 'sourlign2 mono red color',
          $: {
            family: 'monospace',
            foreground: '#9a9a11119797',
            scale: 'small'
          },
          $$: {
            color: '#9a1197',
            tags: ['code', 'small']
          }
        }
      ],
      // '\n',
      [
        {
          _: 'this is the second line, size h2, in pink',
          $: {
            foreground: '#e9e96161c7c7',
            scale: 'h2'
          },
          $$: {
            color: '#e961c7',
            tags: ['h2']
          }
        }
      ],
      // '\n',
      [],
      // '\n',
      ['    this is the fourth line. the previous line was empty']
    ]
  },
  test2: {
    output: [
      ['tesla cyber truck:'],
      // '\n',
      [
        {
          $: {
            justification: 'left'
          },
          $$: {
            'text-align': 'left',
            tags: []
          }
        }
      ],
      // '\n',
      [],
      // '\n',
      [
        'google link: ',
        {
          _: 'https://google.com',
          $: {
            link: 'webs https://google.com'
          },
          $$: {
            tags: [
              [
                'a',
                [
                  {
                    href: 'webs https://google.com'
                  }
                ]
              ]
            ]
          }
        },
        ' '
      ]
    ],
    input: [
      'tesla cyber truck:',
      '\n',
      {
        $: {
          justification: 'left'
        },
        $$: {
          'text-align': 'left',
          tags: []
        }
      },
      '\n',
      '\n',
      'google link: ',
      {
        _: 'https://google.com',
        $: {
          link: 'webs https://google.com'
        },
        $$: {
          tags: [
            [
              'a',
              [
                {
                  href: 'webs https://google.com'
                }
              ]
            ]
          ]
        }
      },
      ' '
    ]
  }
};
describe('it should put nodes into arrays', () => {
  it('test1', () => {
    const { input, output } = testData.test1;
    const seprated = separator(input);
    const res = splitter(seprated);
    console.log(res);
    expect(res).toEqual(output);
  });
  it('test2', () => {
    const { input, output } = testData.test2;
    const seprated = separator(input);
    const res = splitter(seprated);
    console.log(res);
    expect(res).toEqual(output);
  });
});
