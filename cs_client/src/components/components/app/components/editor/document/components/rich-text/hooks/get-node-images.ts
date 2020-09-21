import { useEffect } from 'react';
import { Image } from '::types/graphql/generated';
export const getEditor = (): HTMLDivElement =>
  document.querySelector('#rich-text');
const useAttachImagesToHtml = ({
  node_id,
  html,
  images: nodeImages,
}: {
  file_id;
  node_id;
  nodeId;
  html;
  images: Image[];
}) => {
  useEffect(() => {
    const images = {
      current: undefined,
    };
    if (nodeImages) {
      images.current = new Map<string, string>();
      nodeImages.forEach(image => {
        images.current.set(image.id, image.base64);
      });
    }

    if (images.current) {
      const editor = getEditor();
      const imageElements = Array.from(
        editor.querySelectorAll('img.rich-text__image'),
      );
      imageElements.forEach(img => {
        const id = img.getAttribute('data-id');
        if (images.current.get(id))
          img.setAttribute(
            'src',
            `data:image/png;base64,${images.current.get(id)}`,
          );
        else {
          // img.remove();
        }
      });
    }
  }, [nodeImages, node_id, html]);
};

export { useAttachImagesToHtml };
