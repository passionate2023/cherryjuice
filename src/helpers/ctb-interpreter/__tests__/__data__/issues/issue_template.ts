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
      width: (index + 1) * 100
    }))
  },
  expected: {
    full: [],
    noOtherTables: []
  }
};

export { issue_template };
