const sample_01 = {
  name: 'text',
  ctbXmlString: `<?xml version="1.0" ?><node><rich_text>simlple text
</rich_text><rich_text foreground="#ffff00000000" weight="heavy">bold red </rich_text><rich_text foreground="#6363cccc6363" scale="sub" weight="heavy">green-insider-sub</rich_text><rich_text foreground="#ffff00000000" weight="heavy"> text</rich_text><rich_text>
</rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">const </rich_text><rich_text family="monospace" foreground="#ffc66d" scale="small">RichText</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">: </rich_text><rich_text family="monospace" foreground="#c3d3de" scale="small">React</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">.</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">FC</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">&lt;</rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">Props</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">&gt; </rich_text></node>`,

  midPipe: [
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
  ],
};

export { sample_01 };
