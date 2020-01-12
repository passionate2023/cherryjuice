const renderingBus = {
  bug1_offset_images: {
    description: `images are not positioned where they should
  update: the bug was caused by ghost newlines
    to solve it, i moved the fillGhostNewLines fn to run before insertOtherTables fn
  `,
    txt: `
<?xml version="1.0" ?><node><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small" style="italic">let </rich_text><rich_text family="monospace" scale="small" style="italic">it </rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">= </rich_text><rich_text family="monospace" foreground="#82aaff" scale="small" style="italic">gen</rich_text><rich_text family="monospace" foreground="#f78c6c" scale="small" style="italic">()</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">;
</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#c792ea" scale="small" style="italic">console</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#82aaff" scale="small" style="italic">log</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text background="#9a9a11119797" family="monospace" scale="small" style="italic">it</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#82aaff" scale="small" style="italic">next</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#f78c6c" scale="small" style="italic">())</rich_text><rich_text background="#9a9a11119797" family="monospace" foreground="#89ddff" scale="small" style="italic">;</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">
</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#c792ea" scale="small" style="italic">console</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#82aaff" scale="small" style="italic">log</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#f78c6c" scale="small" style="italic">(</rich_text><rich_text background="#49498b8b4949" family="monospace" scale="small" style="italic">it</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">.</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#82aaff" scale="small" style="italic">next</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#f78c6c" scale="small" style="italic">(5))</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">;</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small" style="italic">
</rich_text><rich_text>

</rich_text><rich_text justification="left"></rich_text><rich_text>


example2
</rich_text><rich_text justification="left"></rich_text><rich_text>
(run is equivalent to it.next)</rich_text></node>
`,
    otherTables: {
      image: [
        {
          offset: 68,
          justification: 'left',
          height: 100,
          width: 100,
        },
        {
          offset: 81,
          justification: 'left',
          height: 200,
          width: 200,
        },
      ],
    },
    expected: {
      full: [
        [],
        [
          { _: 'let ', $: { color: '#c792ea', tags: ['code', 'small', 'em'] } },
          { _: 'it ', $: { tags: ['code', 'small', 'em'] } },
          { _: '= ', $: { color: '#89ddff', tags: ['code', 'small', 'em'] } },
          { _: 'gen', $: { color: '#82aaff', tags: ['code', 'small', 'em'] } },
          { _: '()', $: { color: '#f78c6c', tags: ['code', 'small', 'em'] } },
          { _: ';', $: { color: '#89ddff', tags: ['code', 'small', 'em'] } },
        ],
        [
          {
            _: 'console',
            $: {
              backgroundColor: '#9a1197',
              color: '#c792ea',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'log',
            $: {
              backgroundColor: '#9a1197',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(',
            $: {
              backgroundColor: '#9a1197',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'it',
            $: { backgroundColor: '#9a1197', tags: ['code', 'small', 'em'] },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'next',
            $: {
              backgroundColor: '#9a1197',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '())',
            $: {
              backgroundColor: '#9a1197',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: ';',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
        ],
        [
          {
            _: 'console',
            $: {
              backgroundColor: '#498b49',
              color: '#c792ea',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'log',
            $: {
              backgroundColor: '#498b49',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(',
            $: {
              backgroundColor: '#498b49',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'it',
            $: { backgroundColor: '#498b49', tags: ['code', 'small', 'em'] },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'next',
            $: {
              backgroundColor: '#498b49',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(5))',
            $: {
              backgroundColor: '#498b49',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: ';',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
        ],
        [],
        [],
        [
          {
            type: 'png',
            $: { textAlign: 'left', height: '100px', width: '100px', tags: [] },
            other_attributes: { offset: 68 },
          },
        ],
        [],
        [],
        ['example2'],
        [
          {
            type: 'png',
            $: { textAlign: 'left', height: '200px', width: '200px', tags: [] },
            other_attributes: { offset: 81 },
          },
        ],
        ['(run is equivalent to it.next)'],
      ],
      noOtherTables: [
        [],
        [
          { _: 'let ', $: { color: '#c792ea', tags: ['code', 'small', 'em'] } },
          { _: 'it ', $: { tags: ['code', 'small', 'em '] } },
          { _: '= ', $: { color: '#89ddff', tags: ['code', 'small', 'em'] } },
          { _: 'gen', $: { color: '#82aaff', tags: ['code', 'small', 'em'] } },
          { _: '()', $: { color: '#f78c6c', tags: ['code', 'small', 'em'] } },
          { _: ';', $: { color: '#89ddff', 'tag s': ['code', 'small', 'em'] } },
        ],
        [
          {
            _: 'console',
            $: {
              backgroundColor: '#9a1197',
              color: '#c792ea',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'log',
            $: {
              ' backgroundColor': '#9a1197',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(',
            $: {
              backgroundColor: '#9a1197',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'it',
            $: { backgroundColor: '#9a1197', tags: ['code', 'small', ' em'] },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'next',
            $: {
              'b ackgroundColor': '#9a1197',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '())',
            $: {
              backgroundColor: '#9a1197 ',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: ';',
            $: {
              backgroundColor: '#9a1197',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
        ],
        [
          {
            _: 'console',
            $: {
              backgroundColor: '#498b49',
              color: '#c792ea',
              tags: ['code', 'small', ' em'],
            },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'log',
            $: {
              'ba ckgroundColor': '#498b49',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(',
            $: {
              backgroundColor: '#498b49',
              ' color': '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'it',
            $: { backgroundColor: '#498b49', tags: ['code', 'small', 'em '] },
          },
          {
            _: '.',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: 'next',
            $: {
              'bac kgroundColor': '#498b49',
              color: '#82aaff',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: '(5))',
            $: {
              backgroundColor: '#498b49',
              color: '#f78c6c',
              tags: ['code', 'small', 'em'],
            },
          },
          {
            _: ';',
            $: {
              backgroundColor: '#498b49',
              color: '#89ddff',
              tags: ['code', 'small', 'em'],
            },
          },
        ],
        [],
        [],
        [{ $: { textAlign: 'left', tags: [] } }],
        [],
        [],
        ['example2'],
        [{ $: { textAlign: 'left', 't ags': [] } }],
        ['(run is equivalent to it.next)'],
      ],
    },
  },
};

export { renderingBus };
