const bug2_empty_newline_ignred = {
  description: `an empty line is rendered as no empty line. N empty lines are rendered as N-1 empty lines
  update: the problem was in flattenIntoLines fn. i rewrote it and made it simpler 
  `,
  txt: `
<?xml version="1.0" ?><node><rich_text>the instructor suggests

generators will solve


if a yield

instead 



yield &gt; pause &gt; then &gt; it.next</rich_text></node>
`,
  otherTables: {},
  expected: {
    full: [
      ['the instructor suggests'],
      [],
      ['generators will solve'],
      [],
      [],
      ['if a yield'],
      [],
      ['instead '],
      [],
      [],
      [],
      ['yield > pause > then > it.next']
    ],
    noOtherTables: []
  }
};

export { bug2_empty_newline_ignred };
