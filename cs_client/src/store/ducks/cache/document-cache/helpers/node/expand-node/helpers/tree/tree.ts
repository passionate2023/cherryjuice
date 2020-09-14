import { NodesDict } from '::store/ducks/cache/document-cache';

export type NodeState = {
  [node_id: number]: {
    [node_id: number]: NodeState;
  };
};

export const getParentsNode_ids = (
  fathers: number[] = [],
  nodes: NodesDict,
  node_id: number,
) => {
  const father_id = nodes[node_id]?.father_id;
  if (father_id > 0) {
    fathers.push(father_id);
    getParentsNode_ids(fathers, nodes, father_id);
  }
  return fathers;
};

export const expandNode = (
  nodes: NodesDict,
  tree: NodeState,
  node_id: number,
  expandChildren = true,
) => {
  const father_ids = getParentsNode_ids(undefined, nodes, node_id).reverse();
  if (expandChildren) father_ids.push(node_id);
  let fatherState: NodeState = tree['0'];
  father_ids.forEach(current_node_id => {
    if (!fatherState[current_node_id]) {
      fatherState[current_node_id] = {};
    }
    fatherState = fatherState[current_node_id];
  });
};

export const collapseNode = (
  nodes: NodesDict,
  tree: NodeState,
  node_id: number,
) => {
  const father_ids = getParentsNode_ids(undefined, nodes, node_id).reverse();
  father_ids.push(node_id);
  let fatherState: NodeState = tree['0'];
  for (let i = 0; i < father_ids.length; i++) {
    const current_node_id = father_ids[i];
    if (current_node_id === node_id) {
      delete fatherState[current_node_id];
      break;
    } else {
      fatherState = fatherState[current_node_id];
    }
  }
};

export const flattenTree = (tree: NodeState, list: number[] = []): number[] => {
  Object.entries(tree).forEach(([node_id, subTree]) => {
    list.push(+node_id);
    flattenTree(subTree, list);
  });
  return list;
};

export const unFlattenTree = (flat: number[], nodes: NodesDict): NodeState => {
  const tree = { 0: {} };
  flat.forEach(node_id => {
    if (node_id) expandNode(nodes, tree, node_id);
  });
  return tree;
};
