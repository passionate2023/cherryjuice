import { ac } from '::store/store';
import { useCallback } from 'react';
import {
  CachedDocumentState,
  NodesDict,
  PersistedDocumentState,
} from '::store/ducks/cache/document-cache';
import { ContextMenuItemProps } from '::root/components/shared-components/context-menu/context-menu-item';

type Props = {
  elementId: number;
  hide: () => void;
  documentId: string;
  nodes: NodesDict;
  localState: CachedDocumentState;
  bookmarks: PersistedDocumentState['bookmarks'];
  recentNodes: number[];
};
const useTabContextMenu = ({
  documentId,
  elementId,
  recentNodes,
  localState,
  hide,
  bookmarks = [],
}: Props): Omit<ContextMenuItemProps, 'hide'>[] => {
  const closeSelectedM = useCallback(() => {
    ac.node.close({ documentId, node_id: elementId });
    hide();
  }, [documentId, elementId]);

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
    const others = recentNodes.filter(_node_id => _node_id !== elementId);
    ac.node.close({ documentId, node_ids: others, node_id: elementId });
    hide();
  }, [documentId, recentNodes, elementId]);

  const closeOthersToLeftM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(elementId);
    const others = recentNodes.filter((_, i) => i < indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, elementId]);

  const closeOthersToRightM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(elementId);
    const others = recentNodes.filter((_, i) => i > indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, elementId]);

  const renameM = useCallback(() => {
    ac.node.select({ documentId, node_id: elementId });
    ac.dialogs.showEditNode();
    hide();
  }, [documentId, recentNodes, elementId]);

  const closeDocumentM = useCallback(() => {
    ac.document.setDocumentId('');
    hide();
  }, []);

  const bookmarkM = useCallback(() => {
    !bookmarks.includes(+elementId)
      ? ac.documentCache.addBookmark({ documentId, node_id: elementId })
      : ac.documentCache.removeBookmark({ documentId, node_id: elementId });
    hide();
  }, [documentId, bookmarks, elementId]);

  return [
    {
      name: bookmarks.includes(+elementId) ? 'remove bookmark' : 'bookmark',
      onClick: bookmarkM,
    },
    { name: 'properties', onClick: renameM, bottomSeparator: true },
    { name: 'close', onClick: closeSelectedM },
    { name: 'close all', onClick: closeAllM },
    { name: 'close unchanged', onClick: closeUnchangedM },
    { name: 'close others', onClick: closeOthersM },
    { name: 'close others to the left', onClick: closeOthersToLeftM },
    {
      name: 'close others to the right',
      onClick: closeOthersToRightM,
      bottomSeparator: true,
    },
    { name: 'close document', onClick: closeDocumentM },
  ];
};

export { useTabContextMenu };
