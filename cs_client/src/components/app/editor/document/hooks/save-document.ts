import { useRef } from 'react';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { appActionCreators } from '::app/reducer';
const useSaveDocument = (
  saveDocumentCommandID: string,
  imageIDs: string[] = [],
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
    const { abstractHtml, DDOEsAHtml, imageIDs: currentImageIDs } = getAHtml({
      DDOEs,
      options: { reduceLines: true, useObjForTextNodes: true },
    });
    // eslint-disable-next-line no-unused-vars
    const aHtml = DDOEsAHtml.map((ddoe, i) => ({
      style: ddoe.style,
      nodes: abstractHtml[i],
    }));
    const deletedImages = imageIDs.filter(id => !currentImageIDs.has(id));
    mutate({
      variables: {
        file_id: file_id,
        node_id,
        ahtml: JSON.stringify(aHtml),
        deletedImages,
      },
      update: store => {
        deletedImages.forEach(id => {
          // @ts-ignore
          store.data.delete(`Image:${id}`);
        });
        appActionCreators.reloadDocument();
      },
    });
  }
  return { loading, data, error };
};

export { useSaveDocument };
