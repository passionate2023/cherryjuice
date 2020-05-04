const lineThrough = [
  ...[
    {
      meta: {
        name: 'apply  non-existing line-through on top of existing underline',
      },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: { property: 'text-decoration', value: 'line-through' },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'underline line-through',
      },
    },
    {
      meta: {
        name: 'apply existing line-through on top of existing underline',
      },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline line-through',
        },
        cmd: { property: 'text-decoration', value: 'line-through' },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'underline line-through',
      },
    },
    {
      meta: { name: 'apply non-existing line-through' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
        },
        cmd: { property: 'text-decoration', value: 'line-through' },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'line-through',
      },
    },
  ],
  ...[
    {
      meta: {
        name: 'remove non-existing line-through on top of existing underline',
      },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline',
        },
        cmd: {
          property: 'text-decoration',
          value: 'line-through',
          remove: true,
        },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'underline',
      },
    },
    {
      meta: {
        name: 'remove existing line-through on top of existing underline',
      },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
          'text-decoration': 'underline line-through',
        },
        cmd: {
          property: 'text-decoration',
          value: 'line-through',
          remove: true,
        },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        'text-decoration': 'underline',
      },
    },
    {
      meta: { name: 'remove non-existing line-through' },
      input: {
        ogStyle: {
          'background-color': '#72baff',
          color: '#9b0505',
        },
        cmd: {
          property: 'text-decoration',
          value: 'line-through',
          remove: true,
        },
      },
      output: {
        'background-color': '#72baff',
        color: '#9b0505',
        // 'text-decoration': 'line-through'
      },
    },
  ],
];

export { lineThrough };
