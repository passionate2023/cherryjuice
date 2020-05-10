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
import { NodeMetaIt } from '::types/graphql/generated';
const mutateDocumentMeta = async ({
  cache,
  nodeId,
  mutate,
  editedAttributes,
}: {
  cache;
  nodeId;
  mutate;
  editedAttributes: string[];
}) =>
  await new Promise((res, rej) => {
    const node: NodeCached = cache.data.get('Node:' + nodeId);
    const meta: NodeMetaIt = {};
    editedAttributes.forEach(attribute => {
      meta[attribute] = node[attribute];
    });
    mutate({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
        meta,
      },

      update: () => {
        res();
      },
    }).catch(rej);
  });
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

const useSaveDocument = async ({
  saveDocumentCommandID,
  nodes,
}: {
  saveDocumentCommandID: string;
  nodes: TEditedNodes;
}) => {
  const toolbarQueuesRef = useRef({});
  const [mutateContent] = useMutation(DOCUMENT_MUTATION.ahtml);
  const [mutateMeta] = useMutation(DOCUMENT_MUTATION.meta);
  const {
    apolloClient: { cache },
  } = useContext(RootContext);

  if (
    saveDocumentCommandID &&
    !toolbarQueuesRef.current[saveDocumentCommandID]
  ) {
    toolbarQueuesRef.current[saveDocumentCommandID] = true;
    const editedNodeContent = Object.entries(nodes)
      .filter(([, attributes]) => attributes.edited.content)
      .map(([nodeId]) => nodeId);
    const editedNodeMeta = Object.entries(nodes)
      .filter(([, attributes]) => attributes.edited?.meta.length)
      .map(([nodeId, attributes]) => [nodeId, attributes.edited.meta]);
    for (const [nodeId, editedAttributes] of editedNodeMeta) {
      await mutateDocumentMeta({
        nodeId,
        cache,
        mutate: mutateMeta,
        editedAttributes: editedAttributes as string[],
      });
    }
    for (const nodeId of editedNodeContent) {
      await mutateDocumentContent({ nodeId, cache, mutate: mutateContent() });
    }
    if (editedNodeContent.length) appActionCreators.reloadDocument();
  }
};

export { useSaveDocument };
