import { apolloCache } from '::graphql/cache/apollo-cache';
import { nodesMetaMap } from '::types/misc';
import { QNodeMeta } from '::graphql/queries/document-meta';
import { PrivateNode } from '::types/graphql/generated';

type Props = {
  nodes: QNodeMeta[];
  privateNodes: PrivateNode[];
};
const constructTree = ({
  nodes: nodesArray = [],
  privateNodes,
}: Props): Map<number, QNodeMeta> | undefined => {
  let nodes: Map<number, QNodeMeta> = new Map();
  if (nodesArray.length) {
    nodes = new Map(nodesArray.map(node => [node.node_id, node]));
    privateNodes.forEach(({ node_id, father_id }) => {
      const fatherNode = nodes.get(father_id);
      if (fatherNode) {
        const indexOfChildNode = fatherNode.child_nodes.indexOf(node_id);
        if (indexOfChildNode !== -1) {
          fatherNode.child_nodes.splice(indexOfChildNode, 1);
        }
      }
    });
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
    apolloCache.changes.initDocumentChangesState(file_id);
    nodes = new Map(nodes);
    const modifiedNodes = [
      ...apolloCache.changes
        .document(file_id)
        .node.meta.map(([nodeId]) => nodeId),
      ...apolloCache.changes.document(file_id).node.html,
      ...apolloCache.changes.document(file_id).node.created,
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
