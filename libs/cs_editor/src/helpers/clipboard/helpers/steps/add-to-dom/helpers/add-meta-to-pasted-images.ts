import { getEditor } from '::helpers/pages-manager/helpers/get-editor';
import { replaceImageUrlWithBase64 } from '::helpers/clipboard/helpers/images/replace-image-url-with-base64';
import { bridge } from '::root/bridge';

export const newImagePrefix = 'ni::';
export const newObjectPrefix = 'na::';
export const newNodePrefix = 'nn::';

export const addMetaToPastedImages = () => {
  const editor = getEditor();
  let baseId = new Date().getTime();
  Array.from(editor.querySelectorAll('img:not([class])')).forEach(
    (image: HTMLImageElement) => {
      replaceImageUrlWithBase64(image)
        .then(() => {
          image.classList.add('rich-text__image');
          image.setAttribute('data-id', (newImagePrefix + baseId++).toString());
        })
        .catch(error => {
          image.remove();
          bridge.current.onPasteImageErrorHandler(error);
        });
    },
  );
};
