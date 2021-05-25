import { NodesDict } from '::store/ducks/document-cache/document-cache';

export const getDefaultHighestNode_id = (nodes: NodesDict): number =>
  nodes ? Math.max(...Object.keys(nodes).map(Number)) : 0;
