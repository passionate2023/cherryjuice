import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { stringToMultipleElements } from '::root/components/editor/helpers/execK/helpers';
import { getAHtml } from '::root/components/editor/helpers/rendering/html-to-ahtml';
import { updateDocumentId } from '::store/epics/save-documents/helpers/save-document/helpers/shared';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

const saveNodesContent = async ({ document, state }: SaveOperationProps) => {
  const nodes = Object.entries(document.localState.editedNodes.edited)
    .filter(
      ([node_id, attributes]): boolean =>
        attributes.includes('html') &&
        !state.deletedNodes[document.id][node_id],
    )
    .map(([node_id]) => document.nodes[node_id]);

  for await (let node of nodes) {
    node = updateDocumentId(state)(node);
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
    await apolloClient.mutate({
      ...DOCUMENT_MUTATION.ahtml,
      variables: {
        file_id: node.documentId,
        node_id: node.node_id,
        data: {
          ahtml:
            aHtml.length === 1 && aHtml[0][0].length === 0
              ? '[]'
              : JSON.stringify(aHtml),
          deletedImages:
            document.localState.editedNodes.deletedImages[node.node_id] || [],
          updatedAt: node.updatedAt,
        },
      },
    });
  }
};

export { saveNodesContent };
