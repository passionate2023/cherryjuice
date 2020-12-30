import { urlToBase64 } from '::helpers/clipboard/helpers/images/url-to-base64';
import { anyImageBase64ToPngBase64 } from '::helpers/clipboard/helpers/images/any-image-base64-to-png-base64';

const isNotPngBase64 = (image: HTMLImageElement) =>
  !image.src.startsWith('data:image/png');

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
  } catch {
    return false;
  }

  return true;
};

const attachWidthAndHeight = (image: HTMLImageElement) => () => {
  const { width, height } = image;
  if (width) image.style.width = `${width}px`;
  if (height) image.style.height = `${height}px`;
};
export const replaceImageUrlWithBase64 = async (
  image: HTMLImageElement,
): Promise<void> => {
  if (isValidUrl(image.src)) {
    image.src = await urlToBase64(image.src);
  }
  await new Promise<void>(res => {
    image.onload = () => {
      attachWidthAndHeight(image)();
      if (isNotPngBase64(image)) {
        image.src = anyImageBase64ToPngBase64(image);
      }
      res();
    };
  });
};
