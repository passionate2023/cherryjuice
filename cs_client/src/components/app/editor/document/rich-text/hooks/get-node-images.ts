import { usePng } from '::hooks/use-png';
import { useEffect } from 'react';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';

const useGetNodeImages = ({ html, node_id, file_id, richTextRef }) => {
  let processLinks;
  const all_png_base64 = usePng({
    file_id,
    node_id,
  });
  if (html && all_png_base64?.node_id === node_id && richTextRef.current) {
    let counter = 0;
    while (all_png_base64.pngs[counter] && /<img src=""/.test(html)) {
      const image = all_png_base64.pngs[counter++];
      html = html.replace(
        /<img src=""/,
        `<img data-id="${image.id}" src="data:image/png;base64,${image.base64}"`,
      );
    }
    processLinks = new Date().getTime();
  }

  useEffect(() => {
    if (all_png_base64?.pngs)
      documentActionCreators.setImageIDs(
        String(all_png_base64.node_id),
        all_png_base64.pngs.map(({ id }) => id),
      );
  }, [all_png_base64?.pngs]);

  return { processLinks, html };
};

export { useGetNodeImages };
