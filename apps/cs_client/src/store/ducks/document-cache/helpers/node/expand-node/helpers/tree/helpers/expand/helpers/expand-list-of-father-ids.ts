import {
  NodesDict,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { expandFather_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/helpers/expand-father-ids';

type Props = {
  nodes: NodesDict;
  nodesList: QFullNode[];
  tree: NodeState;
};

export const expandListOfFather_ids = ({ nodesList, tree, nodes }: Props) => {
  const all_father_ids = [];
  const leafs = nodesList.filter(node => !node.child_nodes.length);
  leafs.forEach(leaf => {
    all_father_ids.push(
      getParentsNode_ids({
        fathers: undefined,
        nodes,
        node_id: leaf.node_id,
      }).reverse(),
    );
  });
  all_father_ids.forEach(father_ids => {
    expandFather_ids({ tree, father_ids });
  });
};
