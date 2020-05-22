import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';
import { useEffect } from 'react';

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
          const { width, height } = image;
          image.style.width = `${width}px`;
          image.style.height = `${height}px`;
          image.classList.add('rich-text__image');
          image.setAttribute('data-id', new Date().getTime().toString());
        },
      );
    }
  }, [requestId]);
};

export { useAddMetaToPastedImages };
