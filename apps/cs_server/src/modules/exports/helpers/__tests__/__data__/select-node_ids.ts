import { NodeFromPG } from '../../helpers/ahtml-to-ctb/__tests__/__data__/documents/02';

const selectNode_ids = (node_ids?: number[]) => (
  xs: any[],
): { nodes: NodeFromPG[]; rootNode: NodeFromPG } =>
  xs.reduce(
    (acc, node) => {
      if (node_ids && ![0, ...node_ids].includes(node.node_id)) return acc;
      node = {
        ...node,
        createdAt: new Date(node.createdAt),
        updatedAt: new Date(node.updatedAt),
        child_nodes: node.child_nodes.split(',').filter(Boolean).map(Number),
      };
      if (node.node_id === 0) {
        acc.rootNode = node;
      } else {
        acc.nodes.push(node);
      }
      return acc;
    },
    { nodes: [], rootNode: undefined },
  );

export { selectNode_ids };
