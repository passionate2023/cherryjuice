import {parseTable} from "../parse-table";

const testData = {
  test1: {
    input: {
      table: {
        row: [
          {
            cell: ['yacine', '26']
          },
          {
            cell: ['kamel', '27']
          },
          {
            cell: ['', '']
          },
          {
            cell: ['', '']
          },
          {
            cell: ['', '']
          },
          {
            cell: ['hachemi', '26']
          },
          {
            cell: ['', '']
          },
          {
            cell: ['', '']
          },
          {
            cell: ['amine', '26']
          },
          {
            cell: ['name', 'age']
          }
        ]
      }
    },
    output: {
      th: ['name', 'age'],
      td: [
        ['yacine', '26'],
        ['kamel', '27'],
        ['', ''],
        ['', ''],
        ['', ''],
        ['hachemi', '26'],
        ['', ''],
        ['', ''],
        ['amine', '26']
      ]
    }
  }
};
describe('test table', () => {
  test('simple table', () => {
    const { input, output } = testData.test1;
    const res = parseTable({ xmlTable: input });
    console.log(res)
    expect(res).toEqual(output);
  });
});
