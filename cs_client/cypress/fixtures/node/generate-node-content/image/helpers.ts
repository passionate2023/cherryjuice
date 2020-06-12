import { ImageAst } from './generate-image';

const imgAstToImage = (image: ImageAst): string =>
  `<img ${Object.entries(image.attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')} />`;

const drawText = ({ texts, bg, c, type }) => {
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
  return canvas.toDataURL(type);
};

export { imgAstToImage, drawText };
