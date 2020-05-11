import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { NodeCached } from '::types/graphql/adapters';
import { toNodes } from '::helpers/editing/execK/helpers';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';

const mutateDocumentContent = async ({ cache, nodeId, mutate }) =>
  await new Promise((res, rej) => {
    const { deletedImageIDs } = updateCachedHtmlAndImages(cache);
    const node: NodeCached = cache.data.get('Node:' + nodeId);
    const DDOEs = toNodes(node.html, false);
    const { abstractHtml, DDOEsAHtml } = getAHtml({
      DDOEs: DDOEs as Node[],
      options: { reduceLines: true, useObjForTextNodes: true },
    });
    const aHtml = DDOEsAHtml.map((ddoe, i) => ({
      style: ddoe.style,
      nodes: abstractHtml[i],
    }));
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

export { mutateDocumentContent };
