import {
  NodesDict,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { getAllDescendentsOfNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/helpers/get-all-descendents-of-node';

const sortChild_nodes = ({
  nodes,
  node,
  sortDirection,
}: {
  sortDirection?: SortNodeCommand['sortDirection'];
  nodes: NodesDict;
  node: QFullNode;
}) => {
  node.child_nodes = node.child_nodes.sort((a, b) => {
    const aName = nodes[a];
    const bName = nodes[b];
    return aName.name.localeCompare(bName.name);
  });
  if (sortDirection === 'descending')
    node.child_nodes = node.child_nodes.reverse();
};

export type SortNodeCommand = {
  level: 'current-level' | 'children' | 'all';
  sortBy?: 'name';
  sortDirection?: 'ascending' | 'descending';
};

type Props = {
  nodes: NodesDict;
  node_id: number;
  command: SortNodeCommand;
};

export const _sortNodes = ({
  nodes,
  node_id,
  command: { level, sortDirection },
}: Props): number[] => {
  const affectedNode_ids: number[] = [];
  if (level === 'current-level') {
    const currentNode = nodes[node_id];
    const node = nodes[currentNode.father_id];
    sortChild_nodes({ node, nodes, sortDirection });
    affectedNode_ids.push(node.node_id);
  } else if (level === 'children') {
    sortChild_nodes({ node: nodes[node_id], nodes, sortDirection });
    affectedNode_ids.push(node_id);
    const descendents = getAllDescendentsOfNode({ node_id, nodes });
    descendents.forEach(node => {
      sortChild_nodes({ node, nodes, sortDirection });
      affectedNode_ids.push(node.node_id);
    });
  } else if (level === 'all') {
    Object.values(nodes).forEach(node => {
      sortChild_nodes({ node, nodes, sortDirection });
      affectedNode_ids.push(node.node_id);
    });
  }
  return affectedNode_ids;
};
