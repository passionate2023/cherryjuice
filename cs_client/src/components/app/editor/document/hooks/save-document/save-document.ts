import { useContext, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { appActionCreators } from '::app/reducer';
import { RootContext } from '::root/root-context';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { mutateDocumentMeta } from '::app/editor/document/hooks/save-document/document-meta';
import { mutateDocumentContent } from '::app/editor/document/hooks/save-document/document-content';
import { mutateCreateNode } from '::app/editor/document/hooks/save-document/create-node';
import { NodeCached } from '::types/graphql/adapters';
import {
  documentActionCreators,
  localChanges,
} from '::app/editor/document/reducer/action-creators';
import { mutateDeleteNode } from '::app/editor/document/hooks/save-document/delete-node';

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
  const [mutateCreate] = useMutation(DOCUMENT_MUTATION.createNode.query);
  const [deleteNodeMutation] = useMutation(DOCUMENT_MUTATION.deleteNode.query);
  const {
    apolloClient: { cache },
  } = useContext(RootContext);

  if (
    saveDocumentCommandID &&
    !toolbarQueuesRef.current[saveDocumentCommandID]
  ) {
    toolbarQueuesRef.current[saveDocumentCommandID] = true;

    const deletedNodes = Object.entries(nodes)
      .filter(([, { deleted, new: isNew }]) => deleted && !isNew)
      .map(([nodeId]) => nodeId);
    for (const nodeId of deletedNodes) {
      await mutateDeleteNode({
        nodeId,
        cache,
        mutate: deleteNodeMutation,
      });
      documentActionCreators.clearLocalChanges(nodeId, localChanges.DELETED);
    }
    const newNodes = Object.entries(nodes)
      .filter(([, attributes]) => attributes.new && !attributes.deleted)
      .map(([nodeId]) => nodeId);
    for (const nodeId of newNodes) {
      const data = await mutateCreateNode({
        nodeId,
        cache,
        mutate: mutateCreate,
      });
      const permanentNodeId = DOCUMENT_MUTATION.createNode.path(data);
      if (permanentNodeId) {
        // @ts-ignore
        const node: NodeCached = cache.data.get('Node:' + nodeId);
        node.id = permanentNodeId;
        // @ts-ignore
        cache.data.delete('Node:' + nodeId);
        // @ts-ignore
        cache.data.set('Node:' + permanentNodeId, node);
        nodes[permanentNodeId] = nodes[nodeId];
        delete nodes[nodeId];
      }
      documentActionCreators.clearLocalChanges(nodeId, localChanges.IS_NEW);
    }
    const editedNodeContent = Object.entries(nodes)
      .filter(([, { deleted, edited }]) => edited?.content && !deleted)
      .map(([nodeId]) => nodeId);

    const editedNodeMeta = Object.entries(nodes)
      .filter(
        ([, attributes]) =>
          attributes.edited?.meta?.length &&
          !attributes.new &&
          !attributes.deleted,
      )
      .map(([nodeId, attributes]) => [nodeId, attributes.edited.meta]);
    for (const [nodeId, editedAttributes] of editedNodeMeta) {
      await mutateDocumentMeta({
        nodeId,
        cache,
        mutate: mutateMeta,
        editedAttributes: editedAttributes as string[],
      });
      documentActionCreators.clearLocalChanges(
        nodeId as string,
        localChanges.META,
      );
    }
    for (const nodeId of editedNodeContent) {
      await mutateDocumentContent({ nodeId, cache, mutate: mutateContent });
      documentActionCreators.clearLocalChanges(
        nodeId as string,
        localChanges.CONTENT,
      );
    }

    if (editedNodeContent.length) appActionCreators.reloadDocument();
  }
};

export { useSaveDocument };
