import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { getEditor } from '::editor/components/content-editable/hooks/attach-images-to-html';
import { useEffect } from 'react';
import { replaceImageUrlWithBase64 } from '::editor/helpers/clipboard/helpers/images/replace-image-url-with-base64';
import { bridge } from '::editor/bridge';

export const newImagePrefix = 'ni::';
export const newObjectPrefix = 'na::';
export const newNodePrefix = 'nn::';

type AddMetaToPastedImagesProps = {
  requestId: string | number;
};
const isNotProcessed = createIsNotProcessed();
const useAddMetaToPastedImages = ({
  requestId,
}: AddMetaToPastedImagesProps) => {
  useEffect(() => {
    if (isNotProcessed(requestId)) {
      const editor = getEditor();
      let baseId = new Date().getTime();
      Array.from(editor.querySelectorAll('img:not([class])')).forEach(
        (image: HTMLImageElement) => {
          replaceImageUrlWithBase64(image)
            .then(() => {
              image.classList.add('rich-text__image');
              image.setAttribute(
                'data-id',
                (newImagePrefix + baseId++).toString(),
              );
            })
            .catch(error => {
              image.remove();
              bridge.current.onPasteImageErrorHandler(error);
            });
        },
      );
    }
  }, [requestId]);
};

export { useAddMetaToPastedImages };
