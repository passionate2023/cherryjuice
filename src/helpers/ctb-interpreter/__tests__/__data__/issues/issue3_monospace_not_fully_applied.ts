const issue3_monospace_not_fully_applied = {
  description: `mono richtext is not rendered correctly (styles not applied to all the text)
   update: issue caused by flattenIntoLines fn. on a new line, the fn didnt apply back the styles to all the split parts 
  `,
  txt: `
 <?xml version="1.0" ?><node><rich_text family="monospace" foreground="#89ddff" scale="small">i </rich_text><rich_text family="monospace" scale="small">a </rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">f </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">''</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">;
import * </rich_text><rich_text family="monospace" foreground="#c792ea" scale="small">f </rich_text><rich_text family="monospace" foreground="#c3e88d" scale="small">''</rich_text><rich_text family="monospace" foreground="#89ddff" scale="small">;</rich_text></node> 
`,
  otherTables: {
    image: [],
  },
  expected: {
    full: [
      [
        { _: 'i ', $: { color: '#89ddff', tags: ['code', 'small'] } },
        { _: 'a ', $: { tags: ['code', 'small'] } },
        { _: 'f ', $: { color: '#c792ea', tags: ['code', 'small'] } },
        { _: "''", $: { color: '#c3e88d', tags: ['code', 'small'] } },
        { _: ';', $: { color: '#89ddff', tags: ['code', 'small'] } },
      ],
      [
        { _: 'import * ', $: { color: '#89ddff', tags: ['code', 'small'] } },
        { _: 'f ', $: { color: '#c792ea', tags: ['code', 'small'] } },
        { _: "''", $: { color: '#c3e88d', tags: ['code', 'small'] } },
        { _: ';', $: { color: '#89ddff', tags: ['code', 'small'] } },
      ],
    ],
    noOtherTables: [],
  },
};

export { issue3_monospace_not_fully_applied };
