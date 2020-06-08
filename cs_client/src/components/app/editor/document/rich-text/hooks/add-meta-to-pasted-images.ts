import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';
import { useEffect } from 'react';
import { replaceImageUrlWithBase64 } from '::helpers/editing/clipboard';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';
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
      Array.from(editor.querySelectorAll('img:not([class])')).forEach(
        (image: HTMLImageElement) => {
          replaceImageUrlWithBase64(image)
            .then(() => {
              image.classList.add('rich-text__image');
              image.setAttribute('data-id', new Date().getTime().toString());
            })
            .catch(error => {
              image.remove();
              appActionCreators.setAlert({
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
