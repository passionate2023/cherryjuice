import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';
import { useEffect } from 'react';
const attachWidthAndHeight = (image: HTMLImageElement) => () => {
  const { width, height } = image;
  if (width) image.style.width = `${width}px`;
  if (height) image.style.height = `${height}px`;
};
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
          image.onload = attachWidthAndHeight(image);
          attachWidthAndHeight(image)();
          image.classList.add('rich-text__image');
          image.setAttribute('data-id', new Date().getTime().toString());
        },
      );
    }
  }, [requestId]);
};

export { useAddMetaToPastedImages };
