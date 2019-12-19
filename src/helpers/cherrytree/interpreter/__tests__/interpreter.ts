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
      link: 'node 12 node-_b'
    },
    output: {
      tags: [
        [
          'a',
          [
            {
              href: `node-12#${encodeURIComponent('node-_b')}`
            }
          ]
        ]
      ]
    }
  }
};
describe('map css and attributes', () => {
  test('test1', () => {
    const { input, output } = testData.test1;
    const res = interpreter(input);
    expect(res).toEqual(output);
  });
  test('test2', () => {
    const { input, output } = testData.test2;
    const res = interpreter(input);
    expect(res).toEqual(output);
  });
});
