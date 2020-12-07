const color = [
  ...[
    {
      meta: { name: 'apply non-existing color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          // color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'color', value: '#8c0505' },
      },
      output: {
        'background-color': '#72baff',
        'text-decoration': 'underline',
        color: '#8c0505',
      },
    },

    {
      meta: { name: 'apply existing color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'color', value: '#8c0505' },
      },
      output: {
        'background-color': '#72baff',
        color: '#8c0505',
        'text-decoration': 'underline',
      },
    },
  ],
  ...[
    {
      meta: { name: 'remove non-existing color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          // color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'color', value: '#7d1005', remove: true },
      },
      output: {
        'background-color': '#72baff',
        'text-decoration': 'underline',
        // color: '#9b0505'
      },
    },

    {
      meta: { name: 'remove existing color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'color', value: '#7d1005', remove: true },
      },
      output: {
        'background-color': '#72baff',
        // color: '#9b0505',
        'text-decoration': 'underline',
      },
    },
  ],
];

export { color };
