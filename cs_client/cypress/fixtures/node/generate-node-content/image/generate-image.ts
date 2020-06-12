import { randomArrayElement } from '../../../../support/helpers/javascript-utils';
import { drawText } from './helpers';
type Base64Type = 'image/jpeg' | 'image/png';
type GetBlob = (cb: (blob: Blob) => void) => void;
type ImageAst = {
  getBlob: GetBlob;
  attributes: {
    src: string;
    class?: string;
    id?: string;
    'data-id'?: number;
  };
  meta: {
    format: Base64Type;
    h: number;
    w: number;
    texts: string[];
  };
};

type CreateImageGeneratorProps = {
  texts: string[];
  format: Base64Type | 'random';
  bottomRightCornerWaterMark?: string;
};
const createImageGenerator = bgs => cs => ({
  texts,
  format,
  bottomRightCornerWaterMark,
}: CreateImageGeneratorProps): ImageAst => {
  format =
    format === 'random'
      ? randomArrayElement<Base64Type>(['image/jpeg', 'image/png'])
      : format;
  const { src, getBlob } = drawText({
    texts,
    bg: randomArrayElement(bgs),
    c: randomArrayElement(cs),
    format,
    bottomRightCornerWaterMark,
  });
  return {
    getBlob,
    attributes: {
      src,
      class: 'rich-text__image',
      'data-id': new Date().getTime(),
    },
    meta: {
      format,
      h: 100,
      w: 100,
      texts,
    },
  };
};

export { createImageGenerator };
export { ImageAst, CreateImageGeneratorProps, Base64Type };
