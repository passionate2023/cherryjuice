const issue_07 = {
  name: 'tailing image not rendered',
  description: `regression caused by latest commit: when a misc-node is the last element in the page, it is not rendered
  `,
  txt: `
  <?xml version="1.0" ?><node><rich_text>promises can be chained together
&gt;example
</rich_text><rich_text justification="left"></rich_text><rich_text>
the </rich_text><rich_text family="monospace" scale="small">.then</rich_text><rich_text> on line 5 will &quot;magically&quot; wait for the promise from line 3

&gt;example2
</rich_text><rich_text justification="left"></rich_text></node>
`,
  otherTables: {
    image: [42, 125].map((offset, index) => ({
      offset,
      justification: 'left',
      height: (index + 1) * 100,
      width: (index + 1) * 100,
    })),
    codebox: [].map((offset, index) => ({
      offset,
      justification: 'left',
      txt: 'codebox' + index,
      syntax: 'js',
      height: (index + 1) * 100,
      width: (index + 1) * 100,
      is_width_pix: 1,
      do_highl_bra: 1,
      o_show_linenum: 1,
    })),
    table: [].map((offset, index) => ({
      txt: 'table' + index,
      justification: 'left',
      col_min: (index + 1) * 100,
      col_max: (index + 1) * 100,
    })),
  },
};

export { issue_07 };
