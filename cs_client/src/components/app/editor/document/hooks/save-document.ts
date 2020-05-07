import { useContext, useRef } from 'react';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { appActionCreators } from '::app/reducer';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { RootContext } from '::root/root-context';
import { toNodes } from '::helpers/editing/execK/helpers';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { NodeCached } from '::types/graphql/adapters';
const useSaveDocument = async ({
  saveDocumentCommandID,
  nodes,
}: {
  saveDocumentCommandID: string;
  nodes: TEditedNodes;
}) => {
  const toolbarQueuesRef = useRef({});
  // eslint-disable-next-line no-unused-vars
  const [mutate, { error, loading, data }] = useMutation(
    DOCUMENT_MUTATION.ahtml,
  );
  const {
    apolloClient: { cache },
  } = useContext(RootContext);

  if (
    saveDocumentCommandID &&
    !toolbarQueuesRef.current[saveDocumentCommandID]
  ) {
    const editedNodes = Object.entries(nodes)
      .filter(([, attributes]) => attributes.edited)
      .map(([nodeId]) => nodeId);
    for (const nodeId of editedNodes) {
      await new Promise((res, rej) => {
        toolbarQueuesRef.current[saveDocumentCommandID] = true;
        const { deletedImageIDs } = updateCachedHtmlAndImages(cache);
        // @ts-ignore
        const node: NodeCached = cache.data.get('Node:' + nodeId);
        const DDOEs = toNodes(node.html, false);
        // const DDOEs = Array.from(document.querySelector('#rich-text').childNodes);
        const { abstractHtml, DDOEsAHtml } = getAHtml({
          DDOEs: DDOEs as Node[],
          options: { reduceLines: true, useObjForTextNodes: true },
        });
        // eslint-disable-next-line no-unused-vars
        const aHtml = DDOEsAHtml.map((ddoe, i) => ({
          style: ddoe.style,
          nodes: abstractHtml[i],
        }));
        // @ts-ignore
        // const deletedImages = fetchedImageIDs.filter(
        //   id => !currentImageIDs.has(id),
        // );
        mutate({
          variables: {
            file_id: node.documentId,
            node_id: `${node.node_id}`,
            ahtml: JSON.stringify(aHtml),
            deletedImages: deletedImageIDs,
          },

          update: () => {
            res();
          },
        }).catch(rej);
      });
      if (editedNodes.length) appActionCreators.reloadDocument();
    }
  }
  return { loading, data, error };
};

export { useSaveDocument };
