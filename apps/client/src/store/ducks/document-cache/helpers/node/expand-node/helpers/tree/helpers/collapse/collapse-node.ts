import { NodesDict } from '::store/ducks/document-cache/document-cache';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { expandNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';

export const collapseNode = (
  nodes: NodesDict,
  tree: NodeState,
  node_id: number,
) => {
  if (node_id === 0) tree[0] = {};
  else {
    const father_ids = getParentsNode_ids({
      fathers: undefined,
      nodes,
      node_id,
    }).reverse();
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
    if (node_id) expandNode({ nodes, tree, node_id });
  });
  return tree;
};
