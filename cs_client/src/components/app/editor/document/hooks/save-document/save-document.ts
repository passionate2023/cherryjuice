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
  const {
    apolloClient: { cache },
  } = useContext(RootContext);

  if (
    saveDocumentCommandID &&
    !toolbarQueuesRef.current[saveDocumentCommandID]
  ) {
    toolbarQueuesRef.current[saveDocumentCommandID] = true;

    const newNodes = Object.entries(nodes)
      .filter(([, attributes]) => attributes.new)
      .map(([nodeId]) => nodeId);
    for (const nodeId of newNodes) {
      const data = await mutateCreateNode({
        nodeId,
        cache,
        mutate: mutateCreate,
      });
      const permanantNodeId = DOCUMENT_MUTATION.createNode.path(data);
      if (permanantNodeId) {
        // @ts-ignore
        const node: NodeCached = cache.data.get('Node:' + nodeId);
        node.id = permanantNodeId;
        // @ts-ignore
        cache.data.delete('Node:' + nodeId);
        // @ts-ignore
        cache.data.set('Node:' + permanantNodeId, node);
        nodes[permanantNodeId] = nodes[nodeId];
        delete nodes[nodeId];
      }
      documentActionCreators.clearLocalChanges(nodeId, localChanges.IS_NEW);
    }
    const editedNodeContent = Object.entries(nodes)
      .filter(([, attributes]) => attributes.edited?.content)
      .map(([nodeId]) => nodeId);
    const editedNodeMeta = Object.entries(nodes)
      .filter(
        ([, attributes]) => attributes.edited?.meta?.length && !attributes.new,
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
