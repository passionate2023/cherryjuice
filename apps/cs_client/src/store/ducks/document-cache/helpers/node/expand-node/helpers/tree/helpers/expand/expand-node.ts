import {
  NodesDict,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { expandFather_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/helpers/expand-father-ids';
import { getAllDescendentsOfNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/helpers/get-all-descendents-of-node';
import { expandListOfFather_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/helpers/expand-list-of-father-ids';

export type NodeState = {
  [node_id: number]: {
    [node_id: number]: NodeState;
  };
};

export type ExpandNodeCommands = 'expand-all' | 'expand-all-children';

type Props = {
  nodes: NodesDict;
  tree: NodeState;
  node_id: number;
  expandChildren?: boolean;
  mode?: ExpandNodeCommands;
};

export const expandNode = ({
  nodes,
  tree,
  node_id,
  expandChildren = true,
  mode,
}: Props) => {
  let father_ids: number[];
  if (!mode) {
    father_ids = getParentsNode_ids({
      nodes,
      node_id,
    }).reverse();
    if (expandChildren) father_ids.push(node_id);
    expandFather_ids({ tree, father_ids });
  } else {
    const allNodes: QFullNode[] =
      mode === 'expand-all-children'
        ? getAllDescendentsOfNode({ nodes, node_id })
        : Object.values(nodes);
    expandListOfFather_ids({ nodesList: allNodes, tree, nodes });
  }
};
