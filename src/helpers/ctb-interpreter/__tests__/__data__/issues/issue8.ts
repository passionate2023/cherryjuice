const issue8 = {
  description: `
  similar to issues 6 and 7
  fix: rewrote the insertOtherTables fn
  `,
  txt: `
<?xml version="1.0" ?><node><rich_text>haha
</rich_text><rich_text justification="left"></rich_text></node>
`,
  otherTables: {
    image: [5, 6].map((offset, index) => ({
      offset,
      justification: 'left',
      height: (index + 1) * 100,
      width: (index + 1) * 100
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
      o_show_linenum: 1
    })),
    table: [].map((offset, index) => ({
      txt: 'table' + index,
      justification: 'left',
      col_min: (index + 1) * 100,
      col_max: (index + 1) * 100
    }))
  },
  expected: {
    full: [
      ['haha'],
      [
        {
          type: 'png',
          $: { textAlign: 'left', height: '100px', width: '100px', tags: [] },
          other_attributes: { offset: 5 }
        },
        {
          type: 'png',
          $: { textAlign: 'left', height: '200px', width: '200px', tags: [] },
          other_attributes: { offset: 6 }
        }
      ]
    ],
    noOtherTables: []
  }
};

export { issue8 };
