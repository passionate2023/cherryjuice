const issue_template = {
  description: `
  `,
  txt: `
`,
  otherTables: {
    image: [].map((offset, index) => ({
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

export { issue_template };
