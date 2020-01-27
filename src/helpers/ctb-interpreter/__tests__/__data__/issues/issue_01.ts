const issue_01 = {
  name: 'offset images',
  description: `images are not positioned where they should be
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
};

export { issue_01 };
