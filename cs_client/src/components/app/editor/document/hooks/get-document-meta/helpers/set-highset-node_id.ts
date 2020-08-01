import { ac } from '::root/store/store';
import { nodesMetaMap } from '::types/misc';

const setHighestNodeId = (nodes: nodesMetaMap) => {
  if (nodes) {
    const SET_HIGHEST_NODE_ID = Array.from(nodes.keys())
      .sort((a, b) => a - b)
      .pop();
    ac.document.setHighestNode_id(SET_HIGHEST_NODE_ID);
    const { id, node_id } = nodes.get(0);
    ac.document.selectRootNode({ id, node_id });
  }
};

export { setHighestNodeId };
