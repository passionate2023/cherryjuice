import { interpreter } from '../interpreter';
{
  // const res = interpreter.foreground('#e9e96161c7c7');
  // console.log(
  //   res,
  //   JSON.stringify(res) === JSON.stringify({ color: '#e961c7' })
  // );
}
test('convert object', () => {
  const input = {
    background: '#f1f1c8c8c8c8',
    foreground: '#2c2c44445454',
    style: 'italic',
    weight: 'heavy'
  };
  const output = {
    'background-color': '#f1c8c8',
    color: '#2c4454',
    tags: ['em', 'strong']
  };
  const res = interpreter(input);
  expect(res).toEqual(output)
});
