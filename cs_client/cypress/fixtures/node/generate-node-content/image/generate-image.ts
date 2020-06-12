import { randomArrayElement } from '../../../../support/helpers/javascript-utils';
import { drawText } from './helpers';

type Base64Type = 'image/jpeg' | 'image/png';

type ImageAst = {
  attributes: {
    src: string;
    class?: string;
    id?: string;
  };
  meta: {
    type: Base64Type;
    h: number;
    w: number;
  };
};

const createImageGenerator = bgs => cs => (
  texts: string[],
  type: Base64Type = 'image/jpeg',
): ImageAst => {
  const src = drawText({
    texts,
    bg: randomArrayElement(bgs),
    c: randomArrayElement(cs),
    type,
  });
  return {
    attributes: {
      src,
    },
    meta: {
      type,
      h: 100,
      w: 100,
    },
  };
};

export { createImageGenerator };
export { ImageAst };
