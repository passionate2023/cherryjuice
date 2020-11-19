import { NodesDict } from '::store/ducks/document-cache/document-cache';

type Props = {
  fathers?: number[];
  nodes: NodesDict;
  node_id: number;
};

export const getParentsNode_ids = ({ fathers = [], node_id, nodes }: Props) => {
  const node = nodes[node_id];
  const father_id = node?.father_id;
  if (father_id > 0) {
    fathers.push(father_id);
    getParentsNode_ids({ fathers, nodes, node_id: father_id });
  }
  return fathers;
};
