/* eslint-disable no-useless-escape */
const issue_04 = {
  name: 'offset images',
  description: `similar to issue1
  update: similar to \n, space characters are ignored
    to fix it, updated fillGhostNewLine to cover all \s characters
  `,
  txt: `
<?xml version="1.0" ?><node><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic"> </rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#ffffffffffff" scale="small" style="italic"> 5</rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">
  </rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#c792ea" scale="small" style="italic">let </rich_text><rich_text background="#49498b8b4949" family="monospace" scale="small" style="italic">y </rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">= </rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#f78c6c" scale="small" style="italic">0 </rich_text><rich_text background="#49498b8b4949" family="monospace" foreground="#89ddff" scale="small" style="italic">+ </rich_text><rich_text>

</rich_text><rich_text justification="left"></rich_text><rich_text>


example2
</rich_text><rich_text justification="left"></rich_text><rich_text>
(run is equivalent to it.next)</rich_text></node>
`,
  otherTables: {
    image: [20, 33].map((offset, index) => ({
      offset,
      justification: 'left',
      height: (index + 1) * 100,
      width: (index + 1) * 100,
    })),
  },
};

export { issue_04 };
