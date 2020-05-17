import { NodeMeta } from '::types/graphql/adapters';
import { QUERY_NODE_META } from '::graphql/queries';
import { apolloCache } from '::graphql/cache/apollo-cache';

type Props = {
  data: any;
  // localChanges: TEditedNodes;
  file_id: string;
};
const constructTree = ({
  data,
  // localChanges,
  file_id,
}: Props): Map<number, NodeMeta> => {
  if (apolloCache.changes.document.created.includes(file_id)) {
    if (!data) data = { document: [] };
    if (!data.document) data.document = [];
    data.document.push(apolloCache.document.get(file_id));
  }
  let nodes: Map<number, NodeMeta>;
  const nodesArray = QUERY_NODE_META.path(data) || [];
  if (nodesArray.length) {
    nodes = new Map(nodesArray.map(node => [node.node_id, node]));
    const modifiedNodes = [
      ...apolloCache.changes.node.meta.map(([nodeId]) => nodeId),
      ...apolloCache.changes.node.created,
    ];
    for (const nodeId of modifiedNodes) {
      const node = apolloCache.node.get(nodeId);
      const cacheOutOfSyncWithLocalChanges = !node;
      if (cacheOutOfSyncWithLocalChanges) return undefined;
      nodes.set(node.node_id, node);
    }
  }
  return nodes;
};

export { constructTree };
