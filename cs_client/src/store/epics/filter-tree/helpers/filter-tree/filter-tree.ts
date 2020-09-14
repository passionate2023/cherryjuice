import { NodesDict } from '../../../../ducks/cache/document-cache';
import { getParentsNode_ids } from '../../../../ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';

export type FilteredNodes = { [node_id: number]: true };
export const filterTree = (filter: string, nodes: NodesDict): FilteredNodes => {
  const res: FilteredNodes = {};
  Object.values(nodes).forEach(node => {
    if (node.name.toLowerCase().includes(filter)) {
      res[node.node_id] = true;
      const father_ids = getParentsNode_ids(undefined, nodes, node.node_id);
      father_ids.forEach(father_id => {
        res[father_id] = true;
      });
    }
  });
  return res;
};
