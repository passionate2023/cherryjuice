const n999 = {
  meta: { name: 'n999' },
  input: {
    aHtml: [
      {
        _: 'let ',
        tags: [
          [
            'pre',
            {
              class: 'syntaxbox',
              style: {
                margin: '0px 0px 20px',
                padding: '15px',
                'border-top': '0px solid rgb(61, 126, 154)',
                'border-bottom': '0px solid rgb(61, 126, 154)',
                'border-left': '5px solid rgb(61, 126, 154)',
                'border-right-style': 'solid',
                'border-right-color': 'rgb(61, 126, 154)',
                'border-image': 'initial',
                'font-size': '16px',
                background: 'rgb(238, 238, 238)',
                color: 'rgb(51, 51, 51)',
                position: 'relative',
                'font-family': 'consolas, monaco, "Andale Mono", monospace',
                'font-style': 'normal',
                'font-weight': '700',
                'line-height': '1.5',
                overflow: 'auto',
                'tab-size': '4',
                hyphens: 'none',
                'box-sizing': 'border-box',
                width: '637px',
                'max-width': '100%',
                'white-space': 'pre-wrap',
                'font-variant-ligatures': 'normal',
                'font-variant-caps': 'normal',
                'letter-spacing': '-0.04448px',
                orphans: '2',
                'text-indent': '0px',
                'text-transform': 'none',
                widows: '2',
                'word-spacing': '0px',
                '-webkit-text-stroke-width': '0px',
                'text-decoration-style': 'initial',
                'text-decoration-color': 'initial',
                'border-right-width': '0px',
                direction: 'ltr',
                'text-align': 'left'
              }
            }
          ]
        ]
      },
      {
        _: 'newClone',
        tags: [
          [
            'pre',
            {
              class: 'syntaxbox',
              style: {
                margin: '0px 0px 20px',
                padding: '15px',
                'border-top': '0px solid rgb(61, 126, 154)',
                'border-bottom': '0px solid rgb(61, 126, 154)',
                'border-left': '5px solid rgb(61, 126, 154)',
                'border-right-style': 'solid',
                'border-right-color': 'rgb(61, 126, 154)',
                'border-image': 'initial',
                'font-size': '16px',
                background: 'rgb(238, 238, 238)',
                color: 'rgb(51, 51, 51)',
                position: 'relative',
                'font-family': 'consolas, monaco, "Andale Mono", monospace',
                'font-style': 'normal',
                'font-weight': '700',
                'line-height': '1.5',
                overflow: 'auto',
                'tab-size': '4',
                hyphens: 'none',
                'box-sizing': 'border-box',
                width: '637px',
                'max-width': '100%',
                'white-space': 'pre-wrap',
                'font-variant-ligatures': 'normal',
                'font-variant-caps': 'normal',
                'letter-spacing': '-0.04448px',
                orphans: '2',
                'text-indent': '0px',
                'text-transform': 'none',
                widows: '2',
                'word-spacing': '0px',
                '-webkit-text-stroke-width': '0px',
                'text-decoration-style': 'initial',
                'text-decoration-color': 'initial',
                'border-right-width': '0px',
                direction: 'ltr',
                'text-align': 'left'
              }
            }
          ],
          [
            'var',
            {
              style: {
                margin: '0px',
                padding: '0px',
                border: '0px',
                'font-style': 'italic',
                'font-weight': 'inherit'
              }
            }
          ]
        ]
      },
      { _: 'hello', tags: [['dd', {}]] },
      { _: 'world', tags: [['dd', {}]] }
    ]
  },
  output: [
    {
      _: 'let ',
      tags: [
        [
          'span',
          {
            style: {
              'background-color': 'rgb(238, 238, 238)',
              color: 'rgb(51, 51, 51)'
              // 'font-style': 'normal',
              // 'font-weight': '700',
              // 'text-decoration': 'initial',
              // 'text-align': 'left'
            }
          }
        ],
        ['strong', {}]
      ]
    },
    {
      _: 'newClone',
      tags: [
        [
          'span',
          {
            style: {
              'background-color': 'rgb(238, 238, 238)',
              color: 'rgb(51, 51, 51)'
              // 'font-style': 'normal',
              // 'font-weight': '700',
              // 'text-decoration': 'initial',
              // 'text-align': 'left',
              // 'font-style': 'italic',
              // 'font-weight': 'inherit'
            }
          }
        ],
        ['strong', {}],
        ['em', {}]
      ]
    },
    '\n',
    { _: '&nbsp; &nbsp; hello', tags: [['span', {}]] },
    '\n',
    { _: '&nbsp; &nbsp; world', tags: [['span', {}]] }
  ]
};

export { n999 };
