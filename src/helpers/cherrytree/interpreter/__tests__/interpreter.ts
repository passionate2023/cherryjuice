import { interpreter } from '../interpreter';
{
  // const res = interpreter.foreground('#e9e96161c7c7');
  // console.log(
  //   res,
  //   JSON.stringify(res) === JSON.stringify({ color: '#e961c7' })
  // );
}
// interpretRichText(rawData);
const testData = {
  test1: {
    input: {
      background: '#f1f1c8c8c8c8',
      foreground: '#2c2c44445454',
      style: 'italic',
      weight: 'heavy'
    },
    output: {
      'background-color': '#f1c8c8',
      color: '#2c4454',
      tags: ['em', 'strong']
    }
  },
  test2: {
    input: {
      link: 'node 6 déè_eé&heé&_'
    },
    output: {
      tags: [
        [
          'a',
          {
            href: 'node-6#d%C3%A9%C3%A8_e%C3%A9%26he%C3%A9%26_',
            target: 'node'
          }
        ]
      ]
    }
  },
  test3: {
    input: {
      link: 'webs https://en.wiktionary.org/wiki/%D9%85%D8%B1%D8%AD%D8%A8%D8%A7'
    },
    output: {
      tags: [
        [
          'a',
          {
            href:
              'https://en.wiktionary.org/wiki/%D9%85%D8%B1%D8%AD%D8%A8%D8%A7',
            target: '_blank'
          }
        ]
      ]
    }
  },
  test4: {
    input: {
      family: 'monospace',
      foreground: '#c792ea',
      scale: 'small',
      style: 'italic'
    },
    output: { color: '#c792ea', tags: ['code', 'small', 'em'] }
  }
};
describe('map css and attributes', () => {
  [4]
    .map(index => `test${index}`)
    .forEach(testName => {
      test(testName, () => {
        const { input, output } = testData[testName];
        const res = interpreter(input);
        expect(res).toEqual(output);
      });
    });
  // test('test2', () => {
  //   const { input, output } = testData.test2;
  //   const res = interpreter(input);
  //   expect(res).toEqual(output);
  // });
  // test('test3', () => {
  //   const { input, output } = testData.test3;
  //   const res = interpreter(input);
  //   expect(res).toEqual(output);
  // });
});
