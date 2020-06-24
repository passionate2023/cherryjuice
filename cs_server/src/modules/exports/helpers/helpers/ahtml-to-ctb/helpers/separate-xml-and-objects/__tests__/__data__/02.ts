const sample_02 = {
  name: 'text link image table code',
  ctbXmlString: `<?xml version="1.0" ?><node><rich_text>simlple text
</rich_text><rich_text foreground="#ffff00000000" weight="heavy">bold red </rich_text><rich_text foreground="#6363cccc6363" scale="sub" weight="heavy">green-insider-sub</rich_text><rich_text foreground="#ffff00000000" weight="heavy"> text</rich_text><rich_text>
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">const </rich_text><rich_text family="monospace" foreground="#ffc66d" scale="small">RichText</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">: </rich_text><rich_text family="monospace" foreground="#c3d3de" scale="small">React</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">.</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">FC</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">&lt;</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">Props</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">&gt; </rich_text><rich_text>
node url: </rich_text><rich_text link="node 2 node2">node2</rich_text><rich_text>
http url: </rich_text><rich_text link="webs https://en.wiktionary.org/wiki/%D9%85%D8%B1%D8%AD%D8%A8%D8%A7">wikipedia</rich_text><rich_text> 
folder url: </rich_text><rich_text link="fold RDpcdGVtcA==">temp folder</rich_text><rich_text>
file url: </rich_text><rich_text link="file RDpcdGVtcFxmaWxlLnR4dA==">txt file</rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text><rich_text>
</rich_text><rich_text justification="left"></rich_text></node>`,
  midPipe: [
    'simlple text',
    '\n',
    {
      _: 'bold red ',
      $: {
        foreground: '#ffff00000000',
        weight: 'heavy',
      },
    },
    {
      _: 'green-insider-sub',
      $: {
        foreground: '#6363cccc6363',
        scale: 'sub',
        weight: 'heavy',
      },
    },
    {
      _: ' text',
      $: {
        foreground: '#ffff00000000',
        weight: 'heavy',
      },
    },
    '\n',
    {
      _: 'const ',
      $: {
        family: 'monospace',
        foreground: '#c792ea',
        scale: 'small',
      },
    },
    {
      _: 'RichText',
      $: {
        family: 'monospace',
        foreground: '#ffc66d',
        scale: 'small',
      },
    },
    {
      _: ': ',
      $: {
        family: 'monospace',
        foreground: '#89ddff',
        scale: 'small',
      },
    },
    {
      _: 'React',
      $: {
        family: 'monospace',
        foreground: '#c3d3de',
        scale: 'small',
      },
    },
    {
      _: '.',
      $: {
        family: 'monospace',
        foreground: '#89ddff',
        scale: 'small',
      },
    },
    {
      _: 'FC',
      $: {
        family: 'monospace',
        foreground: '#c3e88d',
        scale: 'small',
      },
    },
    {
      _: '<',
      $: {
        family: 'monospace',
        foreground: '#89ddff',
        scale: 'small',
      },
    },
    {
      _: 'Props',
      $: {
        family: 'monospace',
        foreground: '#c3e88d',
        scale: 'small',
      },
    },
    {
      _: '> ',
      $: {
        family: 'monospace',
        foreground: '#89ddff',
        scale: 'small',
      },
    },
    '\n',
    'node url: ',
    {
      _: 'node2',
      $: {
        link: 'node 2 node2',
      },
    },
    '\n',
    'http url: ',
    {
      _: 'wikipedia',
      $: {
        link:
          'webs https://en.wiktionary.org/wiki/%D9%85%D8%B1%D8%AD%D8%A8%D8%A7',
      },
    },
    ' ',
    '\n',
    'folder url: ',
    {
      _: 'temp folder',
      $: {
        link: 'fold RDpcdGVtcA==',
      },
    },
    '\n',
    'file url: ',
    {
      _: 'txt file',
      $: {
        link: 'file RDpcdGVtcFxmaWxlLnR4dA==',
      },
    },
    '\n',
    {
      type: 'png',
      $: {
        justification: 'left',
        height: 267,
        width: 361,
      },
      other_attributes: {
        offset: 158,
      },
    },
    '\n',
    {
      type: 'table',
      table: {
        td: [
          ['yacine', '26', 'bb'],
          ['kamel', '27', 'got'],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['hachemi', '26', 'mad men'],
          ['', '', ''],
          ['', '', ''],
          ['amine', '26', 'quraych 3'],
        ],
        th: ['name', 'age', 'best series'],
      },
      $: {
        justification: 'left',
      },
      other_attributes: {
        offset: 160,
        col_min_width: 40,
        col_max_width: 600,
      },
    },
    '\n',
    {
      type: 'code',
      _: "console.log('hello');",
      $: {
        justification: 'left',
        width: 900,
        height: 500,
      },
      other_attributes: {
        width_raw: 900,
        offset: 162,
        syntax: 'js',
        is_width_pix: 1,
        do_highl_bra: 1,
      },
    },
  ],
};

export { sample_02 };
