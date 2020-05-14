import {
  documentActionCreators,
  localChanges,
} from '::app/editor/document/reducer/action-creators';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';
import { NodeMetaIt } from '::types/graphql/generated';

const mutateDocumentMeta = async ({
  nodeId,
  mutate,
  editedAttributes,
}: {
  nodeId;
  mutate;
  editedAttributes: string[];
}) =>
  await new Promise((res, rej) => {
    const node: NodeCached = apolloCache.getNode(nodeId);
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

const saveNodesMeta = async ({ nodes, mutate }: SaveOperationProps) => {
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
      mutate,
      editedAttributes: editedAttributes as string[],
    });
    documentActionCreators.clearLocalChanges(
      nodeId as string,
      localChanges.META,
    );
  }
};

export { saveNodesMeta };
