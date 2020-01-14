const issue3_monospace_not_fully_applied = {
  description: `mono richtext is not rendered correctly (styles not applied to all the text)
   update: issue caused by flattenIntoLines fn. on a new line, the fn didnt apply back the styles to all the split parts 
  `,
  txt: `
 <?xml version="1.0" ?><node><rich_text family="monospace" foreground="#89ddff" scale="small">i </rich_text><rich_text family="monospace" scale="small">a </rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">f </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">''</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">;
import * </rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">f </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">''</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">;</rich_text></node> 
`,
  otherTables: {
    image: []
  },
  expected: {
    full: [
      [
        {
          _: 'i ',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#89ddff',
            tags: ['code', 'small']
          }
        },
        { _: 'a ', $: { backgroundColor: '#2B2B2B', tags: ['code', 'small'] } },
        {
          _: 'f ',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#c792ea',
            tags: ['code', 'small']
          }
        },
        {
          _: "''",
          $: {
            backgroundColor: '#2B2B2B',
            color: '#c3e88d',
            tags: ['code', 'small']
          }
        },
        {
          _: ';',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#89ddff',
            tags: ['code', 'small']
          }
        }
      ],
      [
        {
          _: 'import * ',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#89ddff',
            tags: ['code', 'small']
          }
        },
        {
          _: 'f ',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#c792ea',
            tags: ['code', 'small']
          }
        },
        {
          _: "''",
          $: {
            backgroundColor: '#2B2B2B',
            color: '#c3e88d',
            tags: ['code', 'small']
          }
        },
        {
          _: ';',
          $: {
            backgroundColor: '#2B2B2B',
            color: '#89ddff',
            tags: ['code', 'small']
          }
        }
      ]
    ],
    noOtherTables: []
  }
};

export { issue3_monospace_not_fully_applied };
