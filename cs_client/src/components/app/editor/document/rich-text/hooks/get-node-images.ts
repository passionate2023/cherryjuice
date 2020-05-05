import { usePng } from '::hooks/use-png';

const useGetNodeImages = ({ html, node_id, file_id, richTextRef }) => {
  let processLinks;
  const all_png_base64 = usePng({
    file_id,
    node_id,
  });
  if (html && all_png_base64?.node_id === node_id && richTextRef.current) {
    let counter = 0;
    while (all_png_base64.pngs[counter] && /<img src=""/.test(html)) {
      html = html.replace(
        /<img src=""/,
        `<img src="data:image/png;base64,${all_png_base64.pngs[counter++]}"`,
      );
    }
    processLinks = new Date().getTime();
  }
  return { processLinks, html };
};

export { useGetNodeImages };
