import { aHtmlToMidPipe } from '../index';
import { sample_01 } from './__data__';

const testTemplate = ({ pseudoHtml, midPipe }) => {
  const res = aHtmlToMidPipe(pseudoHtml);
  // console.log(JSON.stringify(res, null, 4));
  // expect(JSON.stringify(res, null, 4)).toEqual(
  //   JSON.stringify(ogRender, null, 4),
  // );

  expect(res).toEqual(midPipe);
};

describe.skip('pseudoHtmlToMidPipe', () => {
  test(sample_01.name, () => {
    testTemplate(sample_01);
  });
});
