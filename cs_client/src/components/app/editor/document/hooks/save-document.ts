import { useRef } from 'react';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

const useSaveDocument = saveDocument => {
  const toolbarQueuesRef = useRef({});
  // eslint-disable-next-line no-unused-vars
  const [mutate] = useMutation(DOCUMENT_MUTATION.html);
  if (saveDocument && !toolbarQueuesRef.current[saveDocument]) {
    toolbarQueuesRef.current[saveDocument] = true;
    const DDOEs = Array.from(document.querySelector('#rich-text').childNodes);
    const { abstractHtml, DDOEsAHtml } = getAHtml({
      DDOEs,
      options: { reduceLines: true },
    });
    // eslint-disable-next-line no-unused-vars
    const aHtml = DDOEsAHtml.map((ddoe, i) => ({
      style: ddoe.style,
      nodes: abstractHtml[i],
    }));
    // const html = aHtmlToHtml({
    //   richText: aHtml,
    // });
    // document.querySelector('#rich-text').innerHTML = html;
    //   if (!(saveDocument + '').endsWith('_'))
    //     mutate({
    //       variables: {
    //         file_id: file_id || '',
    //         node_id,
    //         abstract_html: abstractHtml,
    //       },
    //     });
  }
};

export { useSaveDocument };
