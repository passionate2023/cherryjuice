import { isNotPngBase64, isValidUrl } from '::helpers/misc';
import { urlToBase64 } from '::editor/helpers/clipboard/helpers/images/url-to-base64';
import { anyImageBase64ToPngBase64 } from '::editor/helpers/clipboard/helpers/images/any-image-base64-to-png-base64';

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
  await new Promise(res => {
    image.onload = () => {
      attachWidthAndHeight(image)();
      if (isNotPngBase64(image)) {
        image.src = anyImageBase64ToPngBase64(image);
      }
      res();
    };
  });
};
