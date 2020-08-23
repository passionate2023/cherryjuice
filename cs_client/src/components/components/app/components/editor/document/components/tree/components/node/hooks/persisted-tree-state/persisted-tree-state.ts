import { useEffect } from 'react';
import { nodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import { collapseAll, persistedTreeState } from './helpers';
import { NodesDict } from '::store/ducks/cache/document-cache';

type Props = {
  node_id: number;
  file_id: string;
  showChildren: boolean;
  nodes: NodesDict;
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
