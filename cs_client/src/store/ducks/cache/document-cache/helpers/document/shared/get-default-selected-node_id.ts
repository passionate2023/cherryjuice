import { NodesDict } from '::store/ducks/cache/document-cache';

export const getDefaultSelectedNode_id = (nodes: NodesDict) =>
  nodes[0].child_nodes[0] || 0;
