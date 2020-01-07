import { insertOtherTables } from '../steps/insert-other-tables';

const testData = {
  test1: {
    input: {
      otherTables: {
        image: [
          {
            offset: 0,
            justification: 'left',
            width: 90,
            height: 500
          }
        ],
        codebox: [
          {
            offset: 36,
            justification: 'left',
            txt: "console.log('hello');\nArray.from(3)",
            syntax: 'js',
            width: 900,
            height: 500,
            is_width_pix: 1,
            do_highl_bra: 1,
            o_show_linenum: 1
          },
          {
            offset: 65,
            justification: 'left',
            txt: "alert('hello');",
            syntax: 'js',
            width: 90,
            height: 500,
            is_width_pix: 0,
            do_highl_bra: 1,
            o_show_linenum: 1
          }
        ]
      },
      xml: [
        { $: { justification: 'left' } },
        '\nexample: logging into the console\n',
        { $: { justification: 'left' } },
        '\nexample: alerting the user\n',
        { $: { justification: 'left' } },
        '\n\nconclusion: foo bar!'
      ]
    },
    output: [
      {
        type: 'png',
        $: {
          justification: 'left',
          width: 90,
          height: 500
        },
        other_attributes: {
          offset: 0
        }
      },
      '\nexample: logging into the console\n',
      {
        type: 'code',
        _: "console.log('hello');\nArray.from(3)",
        $: {
          justification: 'left',
          width: 900,
          height: 500
        },
        other_attributes: {
          syntax: 'js',
          offset: 36,
          is_width_pix: 1,
          do_highl_bra: 1,
          o_show_linenum: 1,
          width_raw: 900,
        }
      },
      '\nexample: alerting the user\n',
      {
        type: 'code',
        _: "alert('hello');",
        $: {
          justification: 'left',
          width: 90,
          height: 500
        },
        other_attributes: {
          syntax: 'js',
          offset: 65,
          is_width_pix: 0,
          do_highl_bra: 1,
          o_show_linenum: 1,
          width_raw: 90,
        }
      },
      '\n\nconclusion: foo bar!'
    ]
  },
  test2: {
    input: {
      otherTables: {
        image: [
          {
            offset: 0,
            justification: 'left',
            height: 100,
            width: 100
          },
          {
            offset: 2,
            justification: 'left',
            height: 200,
            width: 200
          }
        ]
      },
      xml: ['\n']
    },
    output: [
      {
        type: 'png',
        $: {
          justification: 'left',
          height: 100,
          width: 100
        },
        other_attributes: {
          offset: 0
        }
      },
      '\n',

      {
        type: 'png',
        $: {
          justification: 'left',
          height: 200,
          width: 200
        },
        other_attributes: {
          offset: 2
        }
      }
    ]
  }
};

describe('it should split by newline character', () => {
  it('test1', () => {
    const { input, output } = testData.test1;
    const res = insertOtherTables(input);
    console.log(res);
    expect(res).toEqual(output);
  });
  it('test2', () => {
    const { input, output } = testData.test2;
    const res = insertOtherTables(input);
    console.log(res);
    expect(res).toEqual(output);
  });
});

export { testData as testData_insertOtherTables };
