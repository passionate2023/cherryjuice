import {
  Base64Type,
  CreateImageGeneratorProps,
  ImageAst,
} from './generate-image';

const imgAstToImageHTMLString = (image: ImageAst): string =>
  `<img ${Object.entries(image.attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')} />`;

type DrawTextProps = CreateImageGeneratorProps & {
  bg: string;
  c: string;
  format: Base64Type;
};
const drawText = ({
  texts,
  bg,
  c,
  format,
  bottomRightCornerWaterMark,
}: DrawTextProps) => {
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

  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(format === 'image/png' ? 'P' : 'J', 5, 95);

  if (bottomRightCornerWaterMark) {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(bottomRightCornerWaterMark, 82, 95);
  }
  return {
    src: canvas.toDataURL(format),
    getBlob: cb => {
      ctx.font = '18px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('B', 85, 18);
      canvas.toBlob(cb, format);
    },
  };
};

export { imgAstToImageHTMLString, drawText };
