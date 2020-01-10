import { insertTab } from '../steps/insert-tab';

const testData = {
  test1: {
    input: [
      "const a = () => {\n\t\t\tconsole.log('hello')\t;\n}\n",
      {
        _: "const a = () \t=> {\n\t\t\t\talert('hi\t\t');\n}",
        $: {
          foreground: '#f1f1c8c8c8c8'
        }
      }
    ],
    output:[
      'const a = () => {\n',
      { type: 'tab' },
      { type: 'tab' },
      { type: 'tab' },
      "console.log('hello')",
      { type: 'tab' },
      ';\n}\n',
      { _: 'const a = () ', '$': { foreground: '#f1f1c8c8c8c8' } },
      { type: 'tab' },
      { _: '=> {\n', '$': { foreground: '#f1f1c8c8c8c8' } },
      { type: 'tab' },
      { type: 'tab' },
      { type: 'tab' },
      { type: 'tab' },
      { _: "alert('hi", '$': { foreground: '#f1f1c8c8c8c8' } },
      { type: 'tab' },
      { type: 'tab' },
      { _: "');\n}", '$': { foreground: '#f1f1c8c8c8c8' } }
    ]
  }
};
describe('test tabs', () => {
  test('test1', () => {
    const { input, output } = testData.test1;
    const res = insertTab({ parsedXml: input });
    console.log(res);
    expect(res).toEqual(output);
  });
});
