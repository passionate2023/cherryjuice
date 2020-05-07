import { usePng } from '::hooks/use-png';
import { useEffect } from 'react';

const useAttachImagesToHtml = ({ file_id, node_id }: { file_id; node_id }) => {
  const all_png_base64 = usePng({
    file_id,
    node_id: node_id,
  });
  useEffect(() => {
    if (all_png_base64?.pngs?.length && all_png_base64?.node_id === node_id) {
      const editor = document.querySelector('#rich-text');
      const images = Array.from(
        editor.querySelectorAll('img.rich-text__image'),
      );

      images.forEach((img, i) => {
        img.setAttribute(
          'src',
          `data:image/png;base64,${all_png_base64.pngs[i].base64}`,
        );
        img.setAttribute('data-id', all_png_base64.pngs[i].id);
      });
    }
  }, [all_png_base64?.pngs]);
};

export { useAttachImagesToHtml };
