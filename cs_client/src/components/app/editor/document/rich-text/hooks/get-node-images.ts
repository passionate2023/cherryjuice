import { usePng } from '::hooks/use-png';
import { useEffect } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { UnsavedImage } from '::graphql/cache/helpers/image';
export const getEditor = () => document.querySelector('#rich-text');
const useAttachImagesToHtml = ({
  file_id,
  node_id,
  nodeId,
}: {
  file_id;
  node_id;
  nodeId;
}) => {
  const all_png_base64 = usePng({
    file_id,
    node_id,
  });
  useEffect(() => {
    let images = {
      current: undefined,
    };
    if (all_png_base64?.pngs?.length && all_png_base64?.node_id === node_id) {
      images.current = new Map<string, string>();
      all_png_base64.pngs.forEach(image => {
        images.current.set(image.id, image.base64);
      });
    }
    const pastedImages = apolloCache.changes.image.created[nodeId]?.base64.map(
      apolloCache.image.get,
    );

    if (pastedImages?.length) {
      if (!images.current) images.current = new Map<string, string>();
      pastedImages.forEach((image: UnsavedImage) => {
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
        else img.remove();
      });
    }
  }, [all_png_base64?.pngs, node_id]);
};

export { useAttachImagesToHtml };
