const backgroundColor = [
  ...[
    {
      meta: { name: 'apply non-existing background-color' },
      input: {
        ogStyle: {
          // 'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'background-color', value: '#12ceee' },
      },
      output: {
        color: '#9b0505',
        'text-decoration': 'underline',
        'background-color': '#12ceee',
      },
    },

    {
      meta: { name: 'apply existing background-color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'background-color', value: '#12ceee' },
      },
      output: {
        color: '#9b0505',
        'text-decoration': 'underline',
        'background-color': '#12ceee',
      },
    },
  ],

  ...[
    {
      meta: { name: 'remove non-existing background-color' },
      input: {
        ogStyle: {
          // 'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'background-color', value: '#99baff', remove: true },
      },
      output: {
        color: '#9b0505',
        'text-decoration': 'underline',
        // 'background-color': '#72baff'
      },
    },

    {
      meta: { name: 'remove existing background-color' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'background-color', value: '#99baff', remove: true },
      },
      output: {
        color: '#9b0505',
        'text-decoration': 'underline',
        // 'background-color': '#72baff'
      },
    },
  ],
];

export { backgroundColor };
