import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { stringToMultipleElements } from '::helpers/editing/execK/helpers';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { updateDocumentId } from '::app/editor/document/hooks/save-document/helpers/shared';
import { swapNodeIdIfApplies } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';
import { collectDanglingNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

const saveNodesContent = async ({ state, documentId }: SaveOperationProps) => {
  const editedNodeContent = apolloCache.changes
    .document(documentId)
    .node.html.filter(id => !state.deletedNodes[id])
    .map(swapNodeIdIfApplies(state))
    .map(id => apolloCache.node.get(id));
  for await (const node of editedNodeContent) {
    if (collectDanglingNodes(state)(node)) continue;
    const deletedImages = apolloCache.changes.document(documentId).image
      .deleted[node.id];
    updateDocumentId(state)(node);
    const DDOEs = stringToMultipleElements(node.html);
    const { abstractHtml, DDOEsAHtml } = getAHtml({
      DDOEs: DDOEs as Node[],
      options: {
        reduceLines: true,
        useObjForTextNodes: true,
        swappedImageIds: Object.keys(state.swappedImageIds).length
          ? state.swappedImageIds
          : undefined,
      },
    });
    const aHtml = DDOEsAHtml.map((ddoe, i) => [abstractHtml[i], ddoe.style]);
    await apolloCache.client.mutate({
      ...DOCUMENT_MUTATION.ahtml,
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        data: {
          ahtml:
            aHtml.length === 1 && aHtml[0][0].length === 0
              ? '[]'
              : JSON.stringify(aHtml),
          deletedImages: deletedImages || [],
          updatedAt: node.updatedAt,
        },
      },
    });
  }
};

export { saveNodesContent };
