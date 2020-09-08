import { NodesDict } from '../../../../document-cache';
import { getParentsNode_ids } from '../expand-node/helpers/tree/tree';

export type FilteredNodes = { [node_id: number]: true };
export const filterTree = (filter: string, nodes: NodesDict): FilteredNodes => {
  const res: FilteredNodes = {};
  Object.values(nodes).forEach(node => {
    if (node.name.includes(filter)) {
      res[node.node_id] = true;
      const father_ids = getParentsNode_ids(undefined, nodes, node.node_id);
      father_ids.forEach(father_id => {
        res[father_id] = true;
      });
    }
  });
  return res;
};
