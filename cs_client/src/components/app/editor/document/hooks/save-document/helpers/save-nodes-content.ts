import {
  documentActionCreators,
  localChanges,
} from '::app/editor/document/reducer/action-creators';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';
import { toNodes } from '::helpers/editing/execK/helpers';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';

const mutateDocumentContent = async ({ nodeId, mutate }) =>
  await new Promise((res, rej) => {
    const { deletedImageIDs } = updateCachedHtmlAndImages();
    const node: NodeCached = apolloCache.getNode(nodeId);
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

const saveNodesContent = async ({ nodes, mutate }: SaveOperationProps) => {
  const editedNodeContent = Object.entries(nodes)
    .filter(([, { deleted, edited }]) => edited?.content && !deleted)
    .map(([nodeId]) => nodeId);

  for (const nodeId of editedNodeContent) {
    await mutateDocumentContent({ nodeId, mutate });
    documentActionCreators.clearLocalChanges(
      nodeId as string,
      localChanges.CONTENT,
    );
  }
};

export { saveNodesContent };
