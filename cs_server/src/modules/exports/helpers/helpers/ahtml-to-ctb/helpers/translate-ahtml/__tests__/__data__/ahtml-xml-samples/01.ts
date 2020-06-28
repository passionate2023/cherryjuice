const sample_01 = {
  name: 'text link image table code',
  ahtml: [
    'simlple text',
    '\n',
    {
      _: 'bold red ',
      $: {
        color: 'rgb(255, 0, 0)',
      },
      tags: ['strong'],
    },
    {
      _: 'green-insider-sub',
      $: {
        color: 'rgb(99, 204, 99)',
      },
      tags: ['strong', 'sub'],
    },
    {
      _: ' text',
      $: {
        color: 'rgb(255, 0, 0)',
      },
      tags: ['strong'],
    },
    '\n',
    {
      _: 'const ',
      $: {
        color: 'rgb(199, 146, 234)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: 'RichText',
      $: {
        color: 'rgb(255, 198, 109)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: ': ',
      $: {
        color: 'rgb(137, 221, 255)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: 'React',
      $: {
        color: 'rgb(195, 211, 222)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: '.',
      $: {
        color: 'rgb(137, 221, 255)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: 'FC',
      $: {
        color: 'rgb(195, 232, 141)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: '<',
      $: {
        color: 'rgb(137, 221, 255)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: 'Props',
      $: {
        color: 'rgb(195, 232, 141)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    {
      _: '> ',
      $: {
        color: 'rgb(137, 221, 255)',
        'background-color': 'rgb(43, 43, 43)',
      },
      tags: ['small', 'code'],
    },
    '\n',
    'node url: ',
    {
      $: {},
      tags: ['a'],
      _: 'node2',
      other_attributes: {
        type: 'node',
        href:
          'http://localhost:1236/f41ade8277d9a18b732c499c52ed31f1/node-2#node2',
      },
    },
    '\n',
    'http url: ',
    {
      $: {},
      tags: ['a'],
      _: 'wikipedia',
      other_attributes: {
        type: 'web',
        href: 'https://en.wiktionary.org/wiki/%D9%85%D8%B1%D8%AD%D8%A8%D8%A7',
      },
    },
    ' ',
    '\n',
    'folder url: ',
    {
      $: {},
      tags: ['a'],
      _: 'temp folder',
      other_attributes: {
        type: 'folder',
        href: 'file:///D:/temp',
      },
    },
    '\n',
    'file url: ',
    {
      $: {},
      tags: ['a'],
      _: 'txt file',
      other_attributes: {
        type: 'file',
        href: 'file:///D:/temp/file.txt',
      },
    },
    '\n',
    {
      type: 'png',
      $: {
        width: '361px',
        height: '267px',
      },
      tags: ['img'],
      other_attributes: {
        offset: 158,
      },
    },
    '\n',
    {
      type: 'table',
      $: {},
      tags: ['table'],
      thead: 'name\tage\tbest series\n',
      tbody:
        'yacine\t26\tbb\nkamel\t27\tgot\n\t\t\n\t\t\n\t\t\nhachemi\t26\tmad men\n\t\t\n\t\t\namine\t26\tquraych 3',
      other_attributes: {
        offset: 160,
        col_min_width: 40,
        col_max_width: 600,
      },
    },
    '\n  ',
    '\n',
    {
      $: {
        'max-width': '900px',
        'min-height': '500px',
        width: '900px',
        display: 'inline-block',
      },
      tags: ['code'],
      type: 'code',
      _: "console.log('hello');",
      other_attributes: {
        offset: 165,
        do_highl_bra: 1,
        is_width_pix: 1,
        width_raw: 900,
        syntax: 'js',
      },
    },
    '\n',
    '\n    ',
    '\n',
  ],
  xml: [
    'simlple text',
    '\n',
    {
      _: 'bold red ',
      $: {
        foreground: '#ff0000',
        weight: 'heavy',
      },
    },
    {
      _: 'green-insider-sub',
      $: {
        foreground: '#63cc63',
        scale: 'sub',
        weight: 'heavy',
      },
    },
    {
      _: ' text',
      $: {
        foreground: '#ff0000',
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
export { sample_01 };
