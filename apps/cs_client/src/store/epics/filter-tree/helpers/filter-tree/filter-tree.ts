import { NodesDict } from '::store/ducks/document-cache/document-cache';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';

export type FilteredNodes = { [node_id: number]: true };
export const filterTree = (filter: string, nodes: NodesDict): FilteredNodes => {
  const res: FilteredNodes = {};
  Object.values(nodes).forEach(node => {
    if (
      node.name.toLowerCase().includes(filter) ||
      node.tags?.toLowerCase()?.includes(filter)
    ) {
      res[node.node_id] = true;
      const father_ids = getParentsNode_ids({
        nodes,
        node_id: node.node_id,
      });
      father_ids.forEach(father_id => {
        res[father_id] = true;
      });
    }
  });
  return res;
};
