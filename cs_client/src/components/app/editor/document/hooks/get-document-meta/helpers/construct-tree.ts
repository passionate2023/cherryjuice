import { NodeMeta } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { nodesMetaMap } from '::types/misc';

type Props = {
  nodes: NodeMeta[];
};
const constructTree = ({
  nodes: nodesArray = [],
}: Props): Map<number, NodeMeta> | undefined => {
  let nodes: Map<number, NodeMeta> = new Map();
  if (nodesArray.length) {
    nodes = new Map(nodesArray.map(node => [node.node_id, node]));
  }
  return nodes;
};
const applyLocalModifications = ({
  nodes,
  file_id,
}: {
  file_id: string;
  nodes?: nodesMetaMap;
}) => {
  if (nodes) {
    nodes = new Map(nodes);
    const modifiedNodes = [
      ...apolloCache.changes.node.meta.map(([nodeId]) => nodeId),
      ...apolloCache.changes.node.html,
      ...apolloCache.changes.node.created,
    ];
    for (const nodeId of modifiedNodes) {
      const node = apolloCache.node.get(nodeId);
      if (node?.documentId === file_id) {
        const cacheOutOfSyncWithLocalChanges = !node;
        if (cacheOutOfSyncWithLocalChanges) return undefined;
        nodes.set(node.node_id, node);
      }
    }
  }
  return nodes;
};
export { constructTree, applyLocalModifications };
