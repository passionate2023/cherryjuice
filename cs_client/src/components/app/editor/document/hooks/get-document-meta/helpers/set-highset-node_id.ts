import { appActionCreators } from '::app/reducer';
import { NodeMeta } from '::types/graphql/adapters';

const setHighestNodeId = (nodes: Map<number, NodeMeta>) => {
  if (nodes) {
    const SET_HIGHEST_NODE_ID = Array.from(nodes.keys())
      .sort((a, b) => a - b)
      .pop();
    appActionCreators.setHighestNodeId(SET_HIGHEST_NODE_ID);
    appActionCreators.setRootNode(nodes.get(0));
  }
};

export { setHighestNodeId };
