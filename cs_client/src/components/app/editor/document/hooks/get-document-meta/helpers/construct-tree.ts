import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { NodeMeta } from '::types/graphql/adapters';
import { QUERY_NODE_META } from '::graphql/queries';
import { apolloCache } from '::graphql/cache-helpers';

type Props = {
  data: any;
  localChanges: TEditedNodes;
};
const constructTree = ({
  data,
  localChanges,
}: Props): Map<number, NodeMeta> => {
  let nodes: Map<number, NodeMeta>;
  const nodesArray = QUERY_NODE_META.path(data) || [];
  if (nodesArray.length) {
    nodes = new Map(nodesArray.map(node => [node.node_id, node]));
    for (const [nodeId] of Object.entries(localChanges)) {
      const node = apolloCache.getNode(nodeId);
      const cacheOutOfSyncWithLocalChanges = !node;
      if (cacheOutOfSyncWithLocalChanges) return undefined;
      nodes.set(node.node_id, node);
    }
  }
  return nodes;
};

export { constructTree };
