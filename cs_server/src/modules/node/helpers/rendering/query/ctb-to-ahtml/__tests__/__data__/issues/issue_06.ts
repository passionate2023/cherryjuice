const issue_06 = {
  name: 'adjacent images overlap',
  description: `
  two sibling images rendered as one, adjacent text is duplicated
  update: the issue was in insertOtherTables fn, swapping a <= with < fixed it
`,
  txt: `
   <?xml version="1.0" ?><node><rich_text>- we can think of callbacks as a continuation, a secondary half that runs after a time-gap that separates it from the first half
&quot;w</rich_text><rich_text foreground="#e6e6e6">hen we refer to functions as continuations, what we mean is, we did the first half of our program now, and we wrap the second half of our program up in a callback</rich_text><rich_text>&quot;

- the instructor suggests that callback hell doesnt actually have to do with indentation, as we could rewrite a &quot;callback hell&quot; without nesting
</rich_text><rich_text justification="left"></rich_text><rich_text>
the instructor suggests that t</rich_text><rich_text foreground="#e6e6e6">here are two conceptually deficient</rich_text><rich_text> problems with callbacks</rich_text></node>
  
`,
  otherTables: {
    image: [440, 441].map((offset, index) => ({
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

export { issue_06 };
