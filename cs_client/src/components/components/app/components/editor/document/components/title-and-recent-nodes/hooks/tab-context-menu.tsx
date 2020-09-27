import { ac } from '::store/store';
import { useCallback } from 'react';
import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/cache/document-cache';
import { ContextMenuItemProps } from '::root/components/shared-components/context-menu/context-menu-item';

type Props = {
  focusedNode_id: number;
  hide: () => void;
  documentId: string;
  nodes: NodesDict;
  localState: CachedDocumentState;
  recentNodes: number[];
};
const useTabContextMenu = ({
  documentId,
  focusedNode_id,
  recentNodes,
  localState,
  hide,
}: Props): ContextMenuItemProps[] => {
  const closeSelectedM = useCallback(() => {
    ac.node.close({ documentId, node_id: focusedNode_id });
    hide();
  }, [documentId, focusedNode_id]);

  const closeAllM = useCallback(() => {
    ac.node.close({ documentId, node_ids: recentNodes });
    hide();
  }, [documentId, recentNodes]);

  const closeUnchangedM = useCallback(() => {
    const unchanged = recentNodes.filter(
      node_id => !localState.editedNodes.edited[node_id],
    );
    ac.node.close({ documentId, node_ids: unchanged });
    hide();
  }, [documentId, recentNodes, localState.editedNodes.edited]);

  const closeOthersM = useCallback(() => {
    const others = recentNodes.filter(_node_id => _node_id !== focusedNode_id);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const closeOthersToLeftM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(focusedNode_id);
    const others = recentNodes.filter((_, i) => i < indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const closeOthersToRightM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(focusedNode_id);
    const others = recentNodes.filter((_, i) => i > indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const renameM = useCallback(() => {
    ac.node.select({ documentId, node_id: focusedNode_id });
    ac.dialogs.showEditNode();
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  return [
    { name: 'properties', onClick: renameM, bottomSeparator: true },
    { name: 'close', onClick: closeSelectedM },
    { name: 'close all', onClick: closeAllM },
    { name: 'close unchanged', onClick: closeUnchangedM },
    { name: 'close others', onClick: closeOthersM },
    { name: 'close others to the left', onClick: closeOthersToLeftM },
    { name: 'close others to the right', onClick: closeOthersToRightM },
  ];
};

export { useTabContextMenu };
