import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { useEffect } from 'react';
import { replaceImageUrlWithBase64 } from '::helpers/editing/clipboard/helpers/images/replace-image-url-with-base64';
import { AlertType } from '::types/react';
import { ac } from '::store/store';

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
              ac.dialogs.setAlert({
                title: 'could not download the pasted image',
                type: AlertType.Error,
                description: 'verify your network connection',
                error,
              });
            });
        },
      );
    }
  }, [requestId]);
};

export { useAddMetaToPastedImages };
