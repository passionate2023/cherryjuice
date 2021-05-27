import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';

type Props = {
  tree: NodeState;
  father_ids: number[];
};

export const expandFather_ids = ({ tree, father_ids }: Props) => {
  let fatherState: NodeState = tree['0'];
  father_ids.forEach(current_node_id => {
    if (!fatherState[current_node_id]) {
      fatherState[current_node_id] = {};
    }
    fatherState = fatherState[current_node_id];
  });
};
