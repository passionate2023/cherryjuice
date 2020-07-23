import { useEffect } from 'react';
import { nodeOverlay } from '::app/editor/document/tree/node/helpers/node-overlay';
import { NodeMeta } from '::types/graphql-adapters';
import { collapseAll, persistedTreeState } from './helpers';

type Props = {
  node_id: number;
  file_id: string;
  showChildren: boolean;
  nodes: Map<number, NodeMeta>;
};
const usePersistedTreeState = ({
  node_id,
  file_id,
  showChildren,
  nodes,
}: Props) => {
  useEffect(() => {
    const treeState = persistedTreeState.get(file_id);
    if (showChildren) {
      treeState[node_id] = true;
    } else {
      delete treeState[node_id];
      collapseAll(node_id, treeState, nodes);
    }
    persistedTreeState.set(file_id, treeState);
    nodeOverlay.updateWidth();
  }, [showChildren, node_id]);
};

export { usePersistedTreeState };
