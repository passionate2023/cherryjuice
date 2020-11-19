import {
  NodesDict,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';

type Props = {
  nodes: NodesDict;
  node_id: number;
  descendents?: QFullNode[];
};

export const getAllDescendentsOfNode = ({
  nodes,
  node_id,
  descendents = [],
}: Props): QFullNode[] => {
  const child_nodes = nodes[node_id].child_nodes;
  descendents.push(...child_nodes.map(node_id => nodes[node_id]));
  child_nodes.forEach(node_id =>
    getAllDescendentsOfNode({ nodes, node_id, descendents }),
  );
  return descendents;
};
