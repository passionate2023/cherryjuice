const underline = [
  {
    meta: { name: 'apply non-existing underline' },
    input: {
      ogStyle: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'line-through',
      },
      cmd: { property: 'text-decoration', value: 'underline' },
    },
    output: {
      'background-color': '#72baff',
      color: '#9b0505',
      'text-decoration': 'line-through underline',
    },
  },
  {
    meta: { name: 'apply existing underline' },
    input: {
      ogStyle: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'underline line-through',
      },
      cmd: { property: 'text-decoration', value: 'underline' },
    },
    output: {
      'background-color': '#72baff',
      color: '#9b0505',
      'text-decoration': 'underline line-through',
    },
  },
  {
    meta: { name: 'apply existing underline' },
    input: {
      ogStyle: {
        'background-color': '#72baff',
        color: '#9b0505',
      },
      cmd: { property: 'text-decoration', value: 'underline' },
    },
    output: {
      'background-color': '#72baff',
      color: '#9b0505',
      'text-decoration': 'underline',
    },
  },
];

export { underline };
