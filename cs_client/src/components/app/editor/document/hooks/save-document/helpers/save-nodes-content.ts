import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { stringToMultipleElements } from '::helpers/editing/execK/helpers';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import {
  performMutation,
  updateDocumentId,
} from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';
import { swapNodeIdIfApplies } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';
import { collectDanglingNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';

const saveNodesContent = async ({ mutate, state }: SaveOperationProps) => {
  const editedNodeContent = apolloCache.changes.node.html
    .filter(id => !state.deletedNodes[id])
    .map(swapNodeIdIfApplies(state))
    .map(id => apolloCache.node.get(id));
  for (const node of editedNodeContent) {
    if (collectDanglingNodes(state)(node)) continue;
    const deletedImages = apolloCache.changes.image.deleted[node.id];
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
    const aHtml = DDOEsAHtml.map((ddoe, i) => ({
      style: ddoe.style,
      nodes: abstractHtml[i],
    }));
    await performMutation({
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        ahtml: JSON.stringify(aHtml),
        deletedImages: deletedImages || [],
      },
      mutate,
    });
    apolloCache.changes.unsetModificationFlag(
      localChanges.NODE_CONTENT,
      node.id,
    );
  }
};

export { saveNodesContent };
