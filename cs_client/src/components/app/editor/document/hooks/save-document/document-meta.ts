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

export { mutateDocumentMeta };
