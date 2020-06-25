import { NodeFromPG } from '../../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/02';

const selectNode_ids = (node_ids?: number[]) => (
  xs: any[],
): { nodes: NodeFromPG[]; rootNode: NodeFromPG } =>
  xs
    .filter(node => (node_ids ? [0, ...node_ids].includes(node.node_id) : true))
    .map(node => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
      child_nodes: node.child_nodes
        .split(',')
        .filter(Boolean)
        .map(Number),
    }))
    .reduce(
      (acc, node) => {
        if (node.node_id === 0) {
          if (node_ids) {
            node.child_nodes = node_ids;
          }
          acc.rootNode = node;
        } else {
          acc.nodes.push(node);
        }
        return acc;
      },
      { nodes: [], rootNode: undefined },
    );

export { selectNode_ids };
