import { parseTable } from '../../../steps/parse-table';

const issue5_offset_images_and_tables_and_code_box = {
  description: `
  a codeboxes + images + tables combined in one node are misplaced
  update: the bug was in insertOtherTables fn
  `,
  txt: `
  <?xml version="1.0" ?><node><rich_text>- fr</rich_text><rich_text foreground="#ffffffffffff"> and </rich_text><rich_text family="monospace" foreground="#ffffffffffff">split</rich_text><rich_text foreground="#ffffffffffff">.</rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>


&gt;regex functions
a) regex.test returns a boolean if the pattern matches
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">let </rich_text><rich_text family="monospace" scale="small" style="italic">str </rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">= </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small" style="italic">\`Is this This?\`</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">;

</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">console</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">log</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small" style="italic">/isd/g</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">test</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" scale="small" style="italic">str</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">))</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">; </rich_text><rich_text family="monospace" foreground="#546e7a" scale="small" style="italic">// false
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">console</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">log</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small" style="italic">/is/g</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">test</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" scale="small" style="italic">str</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">))</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">; </rich_text><rich_text family="monospace" foreground="#546e7a" scale="small" style="italic">// true</rich_text><rich_text>

b) regex.exec returns a regexArray
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">let </rich_text><rich_text family="monospace" scale="small" style="italic">str </rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">= </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small" style="italic">\`Is this This?\`</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">;

</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">let </rich_text><rich_text family="monospace" scale="small" style="italic">regex </rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">= </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small" style="italic">/is/g</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">;
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">console</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">log</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" scale="small" style="italic">regex</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">exec</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text family="monospace" scale="small" style="italic">str</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">))</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">;
</rich_text><rich_text family="monospace" foreground="#546e7a" scale="small" style="italic">// [ 'is', index: 5, input: 'Is this This?', groups: undefined ]</rich_text><rich_text>

unlike </rich_text><rich_text family="monospace" scale="small">test</rich_text><rich_text>, the </rich_text><rich_text family="monospace" scale="small">exec</rich_text><rich_text> method is stateful: 
</rich_text><rich_text justification="left"></rich_text><rich_text>

&gt;string functions
a) </rich_text><rich_text family="monospace" scale="small">str.match</rich_text><rich_text>
</rich_text><rich_text foreground="#c792ea" style="italic">let </rich_text><rich_text style="italic">str </rich_text><rich_text foreground="#89ddff" style="italic">= </rich_text><rich_text foreground="#c3e88d" style="italic">\`Is this This?\`</rich_text><rich_text foreground="#89ddff" style="italic">;
</rich_text><rich_text>

&gt;basic regex playground using </rich_text><rich_text family="monospace" scale="small">str.replace</rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>
*
&gt;my react alternative
</rich_text><rich_text justification="left"></rich_text><rich_text>
- full code
</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">i</rich_text></node>
`,
  otherTables: {
    image: [420, 529, 555].map((offset, index) => ({
      offset,
      justification: 'left',
      height: (index + 1) * 100,
      width: (index + 1) * 100
    })),
    codebox: [525, 527].map((offset, index) => ({
      offset,
      justification: 'left',
      txt: 'codebox' + index,
      syntax: 'js',
      height: (index + 1) * 100,
      width: (index + 1) * 100,
      is_width_pix: 1,
      do_highl_bra: 1,
      o_show_linenum: 1
    })),
    table: [16].map((offset, index) => ({
      txt: {
        table: {
          row: [
            {
              cell: ['yacine', '26']
            },
            {
              cell: ['kamel', '27']
            },

            {
              cell: ['hachemi', '26']
            },
            {
              cell: ['', '']
            },
            {
              cell: ['', '']
            },
            {
              cell: ['amine', '26']
            },
            {
              cell: ['name', 'age']
            }
          ]
        }
      },
      offset,
      justification: 'left',
      col_min: (index + 1) * 100,
      col_max: (index + 1) * 100
    }))
  },
  expected: {
    full: [
      [
        '- fr',
        { _: ' and ', $: { color: '#ffffff', tags: [] } },
        {
          _: 'split',
          $: { color: '#ffffff', backgroundColor: '#2B2B2B', tags: ['code'] }
        },
        { _: '.', $: { color: '#ffffff', tags: [] } }
      ],
      [
        {
          type: 'table',
          table: {
            td: [
              ['yacine', '26'],
              ['kamel', '27'],
              ['hachemi', '26'],
              ['', ''],
              ['', ''],
              ['amine', '26']
            ],
            th: ['name', 'age']
          },
          $: { textAlign: 'left', tags: [] },
          other_attributes: {
            offset: 16,
            col_min_width: 100,
            col_max_width: 100
          }
        }
      ],
      [],
      [],
      ['>regex functions'],
      ['a) regex.test returns a boolean if the pattern matches'],
      [
        {
          _: 'let ',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'str ',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '= ',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '`Is this This?`',
          $: {
            color: '#c3e88d',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: ';',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [],
      [
        {
          _: 'console',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'log',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '/isd/g',
          $: {
            color: '#c3e88d',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'test',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'str',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '))',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '; ',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '// false',
          $: {
            color: '#546e7a',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [
        {
          _: 'console',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'log',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '/is/g',
          $: {
            color: '#c3e88d',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'test',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'str',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '))',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '; ',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '// true',
          $: {
            color: '#546e7a',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [],
      ['b) regex.exec returns a regexArray'],
      [
        {
          _: 'let ',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'str ',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '= ',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '`Is this This?`',
          $: {
            color: '#c3e88d',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: ';',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [],
      [
        {
          _: 'let ',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'regex ',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '= ',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '/is/g',
          $: {
            color: '#c3e88d',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: ';',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [
        {
          _: 'console',
          $: {
            color: '#c792ea',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'log',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'regex',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '.',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'exec',
          $: {
            color: '#82aaff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: '(',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: 'str',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small', 'em'] }
        },
        {
          _: '))',
          $: {
            color: '#f78c6c',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        },
        {
          _: ';',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [
        {
          _: "// [ 'is', index: 5, input: 'Is this This?', groups: undefined ]",
          $: {
            color: '#546e7a',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ],
      [],
      [
        'unlike ',
        {
          _: 'test',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small'] }
        },
        ', the ',
        {
          _: 'exec',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small'] }
        },
        ' method is stateful: '
      ],
      [
        {
          type: 'png',
          $: { textAlign: 'left', height: '100px', width: '100px', tags: [] },
          other_attributes: { offset: 420 }
        }
      ],
      [],
      ['>string functions'],
      [
        'a) ',
        {
          _: 'str.match',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small'] }
        }
      ],
      [
        { _: 'let ', $: { color: '#c792ea', tags: ['em'] } },
        { _: 'str ', $: { tags: ['em'] } },
        { _: '= ', $: { color: '#89ddff', tags: ['em'] } },
        { _: '`Is this This?`', $: { color: '#c3e88d', tags: ['em'] } },
        { _: ';', $: { color: '#89ddff', tags: ['em'] } }
      ],
      [],
      [],
      [
        '>basic regex playground using ',
        {
          _: 'str.replace',
          $: { backgroundColor: '#2B2B2B', tags: ['code', 'small'] }
        }
      ],
      [
        {
          type: 'code',
          _: 'codebox0',
          $: { textAlign: 'left', width: '100px', height: '100px', tags: [] },
          other_attributes: {
            width_raw: 100,
            offset: 525,
            syntax: 'js',
            is_width_pix: 1,
            do_highl_bra: 1,
            o_show_linenum: 1
          }
        }
      ],
      [
        {
          type: 'code',
          _: 'codebox1',
          $: { textAlign: 'left', width: '200px', height: '200px', tags: [] },
          other_attributes: {
            width_raw: 200,
            offset: 527,
            syntax: 'js',
            is_width_pix: 1,
            do_highl_bra: 1,
            o_show_linenum: 1
          }
        }
      ],
      [
        {
          type: 'png',
          $: { textAlign: 'left', height: '200px', width: '200px', tags: [] },
          other_attributes: { offset: 529 }
        }
      ],
      ['*'],

      ['>my react alternative'],
      [
        {
          type: 'png',
          $: { textAlign: 'left', height: '300px', width: '300px', tags: [] },
          other_attributes: { offset: 555 }
        }
      ],
      ['- full code'],
      [
        {
          _: 'i',
          $: {
            color: '#89ddff',
            backgroundColor: '#2B2B2B',
            tags: ['code', 'small', 'em']
          }
        }
      ]
    ],
    noOtherTables: []
  }
};

export { issue5_offset_images_and_tables_and_code_box };
