import { useRef } from 'react';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { aHtmlToHtml } from '@cs/ahtml-to-html';
const useSaveDocument = (
  saveDocumentCommandID: string,
  file_id: string,
  node_id: string,
) => {
  const toolbarQueuesRef = useRef({});
  // eslint-disable-next-line no-unused-vars
  const [mutate, { error, loading, data }] = useMutation(
    DOCUMENT_MUTATION.ahtml,
  );
  if (
    saveDocumentCommandID &&
    !toolbarQueuesRef.current[saveDocumentCommandID]
  ) {
    toolbarQueuesRef.current[saveDocumentCommandID] = true;
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
    const html = aHtmlToHtml(aHtml);
    document.querySelector('#rich-text').innerHTML = html;
    if (!(saveDocumentCommandID + '').endsWith('_'))
      mutate({
        variables: {
          file_id: file_id,
          node_id,
          ahtml: JSON.stringify(aHtml),
        },
      });
  }
};

export { useSaveDocument };
