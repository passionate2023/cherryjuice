import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';

const mutateDeleteNode = async ({
  cache,
  nodeId,
  mutate,
}: {
  cache;
  nodeId;
  mutate;
}) =>
  await new Promise((res, rej) => {
    const node: NodeCached = cache.data.get('Node:' + nodeId);

    mutate({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
      },

      update: () => {
        apolloCache.deleteNode(nodeId);
        res();
      },
    }).catch(rej);
  });

export { mutateDeleteNode };
