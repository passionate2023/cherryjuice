import { groupNodesByLine } from '../steps/group-nodes-by-line';
import { flattenIntoLines } from '../steps/flatten-into-lines';
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
  },
  test3: {
    input: [
      {
        type: 'png',
        $: {
          offset: 0,
          justification: 'left'
        }
      },
      '\nexample: logging into the console\n',
      {
        type: 'code',
        _: "console.log('hello');\nArray.from(3)",
        $: {
          offset: 36,
          justification: 'left',
          syntax: 'js',
          width: 900,
          height: 500,
          is_width_pix: 1,
          do_highl_bra: 1,
          o_show_linenum: 1
        }
      },
      '\nexample: alerting the user\n',
      {
        type: 'code',
        _: "alert('hello');",
        $: {
          offset: 65,
          justification: 'left',
          syntax: 'js',
          width: 90,
          height: 500,
          is_width_pix: 0,
          do_highl_bra: 1,
          o_show_linenum: 1
        }
      },
      '\n\nconclusion: foo bar!'
    ]
  }
};
describe('it should put nodes into arrays', () => {
  it('test1', () => {
    const { input, output } = testData.test1;
    const seprated = flattenIntoLines(input);
    const res = groupNodesByLine(seprated);
    console.log(res);
    expect(res).toEqual(output);
  });
  it('test2', () => {
    const { input, output } = testData.test2;
    const seprated = flattenIntoLines(input);
    const res = groupNodesByLine(seprated);
    console.log(res);
    expect(res).toEqual(output);
  });
  it('test3', () => {
    const { input } = testData.test3;
    const seprated = flattenIntoLines(input);
    const res = groupNodesByLine(seprated);
    console.log(res);
    // expect(res).toEqual(output);
    return true;
  });
});
