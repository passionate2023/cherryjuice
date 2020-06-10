import { nodesMetaMap } from '::types/misc';
import { NodeId } from '../document';
const defaultRootNode = { node_id: 0, id: '' };
const getFallbackNode = (nodes: nodesMetaMap): NodeId => {
  if (!nodes?.size) return defaultRootNode;
  const root = nodes.get(0);
  const firstNode_id = root.child_nodes.sort((a, b) => a - b)[0];
  const { id, node_id } = firstNode_id ? nodes.get(firstNode_id) : root;
  return { id, node_id };
};
const getFlatListOfChildrenTree = (arr: number[] = []) => (
  nodes: nodesMetaMap,
) => (node_id: number) => {
  nodes
    .get(node_id)
    ?.child_nodes.forEach(
      getFlatListOfChildrenTree((arr.push(node_id), arr))(nodes),
    );
  return arr;
};
const calcRecentNodes = ({
  removeChildren,
  selectedNode_id,
  recentNodes,
  nodes,
}: {
  nodes: nodesMetaMap;
  recentNodes: number[];
  selectedNode_id: number;
  removeChildren: boolean;
}): number[] => {
  const toRemoveFromRecentNodes = Object.fromEntries(
    (removeChildren
      ? getFlatListOfChildrenTree()(nodes)(selectedNode_id)
      : [selectedNode_id]
    ).map(node_id => [node_id, true]),
  );

  return recentNodes.filter(node_id => !toRemoveFromRecentNodes[node_id]);
};

export {
  getFallbackNode,
  defaultRootNode,
  getFlatListOfChildrenTree,
  calcRecentNodes,
};
