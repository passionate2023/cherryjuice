import { randomArrayElement } from '../../support/helpers/javascript-utils';
type ImageAst = {
  src: string;
  style: string;
  class: string;
  'data-id': string;
};
const drawText = ({ texts, bg, c }) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '25px Arial';
  ctx.strokeStyle = c;
  texts.forEach((text, i) => {
    ctx.strokeText(text, 5, 40 + i * 30);
  });
  return canvas.toDataURL('image/png');
};

const createImageGenerator = bgs => cs => texts => {
  const src = drawText({
    texts,
    bg: randomArrayElement(bgs),
    c: randomArrayElement(cs),
  });
  return {
    src,
    style: 'width: 100px;height:100px;',
    class: 'rich-text__image',
    'data-id': new Date().getTime().toString(),
  };
  // return `<img ${[
  //   `src="${src}"`,
  //   `style="width: 100px;height:100px;"`,
  //   `class="rich-text__image" `,
  //   `data-id="${new Date().getTime().toString()}"`,
  // ].join(' ')} />`;
};
const imgAstToImage = (image: ImageAst): string =>
  `<img ${Object.entries(image)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ')} />`;
export { createImageGenerator ,imgAstToImage};

export {ImageAst}